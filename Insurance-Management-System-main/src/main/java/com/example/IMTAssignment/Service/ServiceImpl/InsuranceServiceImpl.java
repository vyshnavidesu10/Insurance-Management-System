
package com.example.IMTAssignment.Service.ServiceImpl;

import com.example.IMTAssignment.DTOs.InsurancePolicyDto;
import com.example.IMTAssignment.DTOs.InsurancePolicyUpdateReqDto;
import com.example.IMTAssignment.DTOs.InsuranceResponse.ClientResponseForInsuranceDto;
import com.example.IMTAssignment.DTOs.InsuranceResponse.InsurancePolicyResponseDto;
import com.example.IMTAssignment.Models.Client;
import com.example.IMTAssignment.Models.InsurancePolicy;
import com.example.IMTAssignment.Repository.ClientRepository;
import com.example.IMTAssignment.Repository.InsuranceRepository;
import com.example.IMTAssignment.Service.InsuranceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class InsuranceServiceImpl implements InsuranceService {

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    InsuranceRepository insuranceRepository;

    // Add Insurance Policy
    @Override
    public String addInsurancePolicy(InsurancePolicyDto insurancePolicyDto) throws Exception {

        InsurancePolicy insurancePolicy = new InsurancePolicy();

        Client client = clientRepository.findByName(insurancePolicyDto.getClientName());

        if (client == null) {
            throw new Exception("Client not found");
        }

        insurancePolicy.setPolicyNumber(insurancePolicyDto.getPolicyNumber());
        insurancePolicy.setType(insurancePolicyDto.getInsuranceType());
        insurancePolicy.setCoverageAmount(insurancePolicyDto.getCoverageAmount());
        insurancePolicy.setPremium(insurancePolicyDto.getPremium());
        insurancePolicy.setStartDate(insurancePolicyDto.getStartDate());
        insurancePolicy.setEndDate(insurancePolicyDto.getEndDate());
        insurancePolicy.setClient(client);

        client.setInsurancePolicy(insurancePolicy);

        insuranceRepository.save(insurancePolicy);
        clientRepository.save(client);

        return "insurance policy added successfully...";
    }

    // Get Insurance Policy By ID
    @Override
    public InsurancePolicyResponseDto getInsurance(Integer id) throws Exception {

        InsurancePolicy insurancePolicy = insuranceRepository.findById(id)
                .orElseThrow(() -> new Exception("Insurance policy not found"));

        InsurancePolicyResponseDto dto = new InsurancePolicyResponseDto();

        dto.setId(insurancePolicy.getId());

        ClientResponseForInsuranceDto clientDto = new ClientResponseForInsuranceDto();

        if (insurancePolicy.getClient() != null) {
            clientDto.setName(insurancePolicy.getClient().getName());
            clientDto.setDateOfBirth(insurancePolicy.getClient().getBirthDate());
            clientDto.setAddress(insurancePolicy.getClient().getAddress());
            clientDto.setContact(insurancePolicy.getClient().getContact());
        }

        dto.setPolicyNumber(insurancePolicy.getPolicyNumber());
        dto.setInsuranceType(insurancePolicy.getType());
        dto.setCoverageAmount(insurancePolicy.getCoverageAmount());
        dto.setPremium(insurancePolicy.getPremium());
        dto.setStartDate(insurancePolicy.getStartDate());
        dto.setEndDate(insurancePolicy.getEndDate());
        dto.setClient(clientDto);

        return dto;
    }

    // Get All Insurance Policies (Admin)
    @Override
    public List<InsurancePolicyResponseDto> getAllInsurancePolicies() throws Exception {

        List<InsurancePolicy> insurancePolicyList = insuranceRepository.findAll();

        List<InsurancePolicyResponseDto> responseList = new ArrayList<>();

        for (InsurancePolicy insurancePolicy : insurancePolicyList) {

            InsurancePolicyResponseDto dto = new InsurancePolicyResponseDto();

            dto.setId(insurancePolicy.getId());

            ClientResponseForInsuranceDto clientDto = new ClientResponseForInsuranceDto();

            if (insurancePolicy.getClient() != null) {
                clientDto.setName(insurancePolicy.getClient().getName());
                clientDto.setDateOfBirth(insurancePolicy.getClient().getBirthDate());
                clientDto.setAddress(insurancePolicy.getClient().getAddress());
                clientDto.setContact(insurancePolicy.getClient().getContact());
            }

            dto.setPolicyNumber(insurancePolicy.getPolicyNumber());
            dto.setInsuranceType(insurancePolicy.getType());
            dto.setCoverageAmount(insurancePolicy.getCoverageAmount());
            dto.setPremium(insurancePolicy.getPremium());
            dto.setStartDate(insurancePolicy.getStartDate());
            dto.setEndDate(insurancePolicy.getEndDate());
            dto.setClient(clientDto);

            responseList.add(dto);
        }

        return responseList;
    }

    

 // Delete Insurance Policy
 @Override
 public String deletePolicy(Integer id) throws Exception {

     InsurancePolicy insurancePolicy = insuranceRepository.findById(id)
             .orElseThrow(() -> new Exception("Insurance policy not found"));

     insuranceRepository.delete(insurancePolicy);

     // Force the delete operation to execute in the database
     insuranceRepository.flush();

     // Verify whether the policy still exists
     boolean exists = insuranceRepository.existsById(id);

     if (exists) {
         throw new Exception("Policy deletion failed");
     }

     return "Policy deleted successfully";
 }


    // Update Insurance Policy
    @Override
    public String updatePolicy(Integer id, InsurancePolicyUpdateReqDto insurancePolicyUpdateReqDto) throws Exception {

        InsurancePolicy insurancePolicy = insuranceRepository.findById(id)
                .orElseThrow(() -> new Exception("Insurance policy not found"));

        insurancePolicy.setType(insurancePolicyUpdateReqDto.getInsuranceType());
        insurancePolicy.setCoverageAmount(insurancePolicyUpdateReqDto.getCoverageAmount());
        insurancePolicy.setPremium(insurancePolicyUpdateReqDto.getPremium());
        insurancePolicy.setEndDate(insurancePolicyUpdateReqDto.getEndDate());

        insuranceRepository.save(insurancePolicy);

        return "client updated successfully.....";
    }

    // Get Insurance Policies By Client ID
    @Override
    public List<InsurancePolicyResponseDto> getPoliciesByClient(Integer clientId) throws Exception {

        List<InsurancePolicy> insurancePolicyList =
                insuranceRepository.findByClientId(clientId);

        List<InsurancePolicyResponseDto> responseList = new ArrayList<>();

        for (InsurancePolicy insurancePolicy : insurancePolicyList) {

            InsurancePolicyResponseDto dto = new InsurancePolicyResponseDto();

            dto.setId(insurancePolicy.getId());
            dto.setPolicyNumber(insurancePolicy.getPolicyNumber());
            dto.setInsuranceType(insurancePolicy.getType());
            dto.setCoverageAmount(insurancePolicy.getCoverageAmount());
            dto.setPremium(insurancePolicy.getPremium());
            dto.setStartDate(insurancePolicy.getStartDate());
            dto.setEndDate(insurancePolicy.getEndDate());

            Client client = insurancePolicy.getClient();

            if (client != null) {

                ClientResponseForInsuranceDto clientDto =
                        new ClientResponseForInsuranceDto();

                clientDto.setName(client.getName());
                clientDto.setDateOfBirth(client.getBirthDate());
                clientDto.setAddress(client.getAddress());
                clientDto.setContact(client.getContact());

                dto.setClient(clientDto);
            }

            responseList.add(dto);
        }

        return responseList;
    }
}
