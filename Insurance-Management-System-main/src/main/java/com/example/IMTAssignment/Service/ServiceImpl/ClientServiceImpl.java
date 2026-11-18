
package com.example.IMTAssignment.Service.ServiceImpl;

import com.example.IMTAssignment.DTOs.ClientDto;
import com.example.IMTAssignment.DTOs.ClientRegistrationDto;
import com.example.IMTAssignment.DTOs.ClientResponse.ClientResponseDto;
import com.example.IMTAssignment.DTOs.ClientResponse.InsuranceResponseForClientDto;
import com.example.IMTAssignment.DTOs.ClientUpdateReqDto;

import com.example.IMTAssignment.Models.Client;
import com.example.IMTAssignment.Models.UserInfo;

import com.example.IMTAssignment.Repository.ClientRepository;
import com.example.IMTAssignment.Repository.UserInfoRepository;

import com.example.IMTAssignment.Service.ClientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    // ADD CUSTOMER
    @Override
    public String addClient(ClientDto clientDto) throws Exception {

        Client client = new Client();

        client.setName(clientDto.getName());
        client.setBirthDate(clientDto.getDateOfBirth());
        client.setAddress(clientDto.getAddress());
        client.setContact(clientDto.getContact());

        clientRepository.save(client);

        return "client added successfully...";
    }


    // VIEW ONE CUSTOMER
    @Override
    public ClientResponseDto getClient(Integer id) throws Exception {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                    new Exception("Client not found with ID: " + id));

        ClientResponseDto clientResponseDto = new ClientResponseDto();

        clientResponseDto.setId(client.getId());
        clientResponseDto.setName(client.getName());
        clientResponseDto.setDateOfBirth(client.getBirthDate());
        clientResponseDto.setAddress(client.getAddress());
        clientResponseDto.setContact(client.getContact());

        // Check insurance policy
        if (client.getInsurancePolicy() != null) {

            InsuranceResponseForClientDto insuranceResponseForClientDto =
                    new InsuranceResponseForClientDto();

            insuranceResponseForClientDto.setNumber(
                    client.getInsurancePolicy().getPolicyNumber());

            insuranceResponseForClientDto.setId(
                    client.getInsurancePolicy().getId());

            insuranceResponseForClientDto.setInsuranceType(
                    client.getInsurancePolicy().getType());

            insuranceResponseForClientDto.setCoverageAmount(
                    client.getInsurancePolicy().getCoverageAmount());

            insuranceResponseForClientDto.setPremium(
                    client.getInsurancePolicy().getPremium());

            insuranceResponseForClientDto.setStartDate(
                    client.getInsurancePolicy().getStartDate());

            insuranceResponseForClientDto.setEndDate(
                    client.getInsurancePolicy().getEndDate());

            clientResponseDto.setInsurancePolicy(
                    insuranceResponseForClientDto);

        } else {
            clientResponseDto.setInsurancePolicy(null);
        }

        return clientResponseDto;
    }


    // VIEW ALL CUSTOMERS
    @Override
    public List<ClientResponseDto> getAllClient() throws Exception {

        List<Client> clientList = clientRepository.findAll();

        List<ClientResponseDto> clientResponseDtoList = new ArrayList<>();

        for (Client client : clientList) {

            ClientResponseDto clientResponseDto = new ClientResponseDto();

            clientResponseDto.setId(client.getId());
            clientResponseDto.setName(client.getName());
            clientResponseDto.setDateOfBirth(client.getBirthDate());
            clientResponseDto.setAddress(client.getAddress());
            clientResponseDto.setContact(client.getContact());

            // Check whether insurance policy exists
            if (client.getInsurancePolicy() != null) {

                InsuranceResponseForClientDto insuranceResponseForClientDto =
                        new InsuranceResponseForClientDto();

                insuranceResponseForClientDto.setNumber(
                        client.getInsurancePolicy().getPolicyNumber());

                insuranceResponseForClientDto.setId(
                        client.getInsurancePolicy().getId());

                insuranceResponseForClientDto.setInsuranceType(
                        client.getInsurancePolicy().getType());

                insuranceResponseForClientDto.setCoverageAmount(
                        client.getInsurancePolicy().getCoverageAmount());

                insuranceResponseForClientDto.setPremium(
                        client.getInsurancePolicy().getPremium());

                insuranceResponseForClientDto.setStartDate(
                        client.getInsurancePolicy().getStartDate());

                insuranceResponseForClientDto.setEndDate(
                        client.getInsurancePolicy().getEndDate());

                clientResponseDto.setInsurancePolicy(
                        insuranceResponseForClientDto);

            } else {
                clientResponseDto.setInsurancePolicy(null);
            }

            clientResponseDtoList.add(clientResponseDto);
        }

        return clientResponseDtoList;
    }


    // DELETE CUSTOMER
    @Override
    public String deleteClient(Integer id) throws Exception {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                    new Exception("Client not found with ID: " + id));

        clientRepository.delete(client);

        return "client deleted successfully...";
    }


    // UPDATE CUSTOMER
    @Override
    public String updateClient(
            Integer id,
            ClientUpdateReqDto clientUpdateReqDto) throws Exception {

        Client client = clientRepository.findById(id)
                .orElseThrow(() ->
                    new Exception("Client not found with ID: " + id));

        client.setAddress(clientUpdateReqDto.getAddress());
        client.setContact(clientUpdateReqDto.getContact());

        clientRepository.save(client);

        return "client updated successfully...";
    }


    // CLIENT REGISTRATION
    @Override
    @Transactional
    public String registerClient(ClientRegistrationDto dto) throws Exception {

        // Check whether email already exists
        if (userInfoRepository.findByUsername(dto.getEmail()).isPresent()) {
            throw new Exception("Email already registered");
        }

        // Create Client profile
        Client client = new Client();

        client.setName(dto.getName());
        client.setBirthDate(dto.getDateOfBirth());
        client.setAddress(dto.getAddress());
        client.setContact(dto.getContact());

        // Save Client details
        Client savedClient = clientRepository.save(client);

        // Create login account
        UserInfo userInfo = new UserInfo();

        userInfo.setUsername(dto.getEmail());

        // Encrypt password using BCrypt
        userInfo.setPassword(
                passwordEncoder.encode(dto.getPassword()));

        // Assign client role
        userInfo.setRole("ROLE_USER");

        // Link login account with Client
        userInfo.setClient(savedClient);

        // Save login account
        userInfoRepository.save(userInfo);

        return "Client registered successfully";
    }
}
