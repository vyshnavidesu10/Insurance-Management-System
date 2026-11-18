
package com.example.IMTAssignment.Controller;

import com.example.IMTAssignment.DTOs.ClientDto;
import com.example.IMTAssignment.DTOs.ClientRegistrationDto;
import com.example.IMTAssignment.DTOs.ClientResponse.ClientResponseDto;
import com.example.IMTAssignment.DTOs.ClientUpdateReqDto;
import com.example.IMTAssignment.DTOs.InsuranceResponse.InsurancePolicyResponseDto;
import com.example.IMTAssignment.Models.Client;
import com.example.IMTAssignment.Models.UserInfo;
import com.example.IMTAssignment.Repository.UserInfoRepository;
import com.example.IMTAssignment.Service.ClientService;
import com.example.IMTAssignment.Service.InsuranceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/client")
public class ClientController {

    @Autowired
    ClientService clientService;

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    InsuranceService insuranceService;

    // ADD CUSTOMER
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity addClient(@RequestBody ClientDto clientDto) {
        try {
            String result = clientService.addClient(clientDto);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("client not added",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // GET CUSTOMER BY ID
    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity getClient(@PathVariable("id") Integer id) {
        try {
            ClientResponseDto clientResponseDto =
                    clientService.getClient(id);

            return new ResponseEntity<>(
                    clientResponseDto, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("please check client id!!!",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // GET ALL CUSTOMERS
    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity getAllClient() {
        try {
            List<ClientResponseDto> clientResponseDtoList =
                    clientService.getAllClient();

            return new ResponseEntity<>(
                    clientResponseDtoList, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("list of client not found!!!",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // DELETE CUSTOMER
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity deleteClient(@PathVariable("id") Integer id) {
        try {
            String result = clientService.deleteClient(id);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("error occurred while deleting client!!!",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // UPDATE CUSTOMER
    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity updateClient(
            @PathVariable("id") Integer id,
            @RequestBody ClientUpdateReqDto clientUpdateReqDto) {
        try {
            String result = clientService.updateClient(
                    id, clientUpdateReqDto);

            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("error occurred while updating client",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // CLIENT REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<String> registerClient(
            @RequestBody ClientRegistrationDto dto) {
        try {
            String result = clientService.registerClient(dto);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(
                    e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // GET LOGGED-IN CLIENT PROFILE
    @GetMapping("/me")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> getLoggedInClient(
            Authentication authentication) {
        try {
            UserInfo userInfo = userInfoRepository
                    .findByUsername(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            if (userInfo.getClient() == null) {
                return ResponseEntity.notFound().build();
            }

            Client client = userInfo.getClient();

            ClientResponseDto dto = new ClientResponseDto();

            dto.setId(client.getId());
            dto.setName(client.getName());
            dto.setDateOfBirth(client.getBirthDate());
            dto.setAddress(client.getAddress());
            dto.setContact(client.getContact());
            dto.setInsurancePolicy(null);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to retrieve client profile");
        }
    }

    // GET INSURANCE POLICIES OF LOGGED-IN CLIENT
    @GetMapping("/my-insurance")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> getMyInsurance(
            Authentication authentication) {
        try {
            UserInfo userInfo = userInfoRepository
                    .findByUsername(authentication.getName())
                    .orElseThrow(() ->
                            new RuntimeException("User not found"));

            if (userInfo.getClient() == null) {
                return ResponseEntity.notFound().build();
            }

            Integer clientId = userInfo.getClient().getId();

            List<InsurancePolicyResponseDto> policies =
                    insuranceService.getPoliciesByClient(clientId);

            return ResponseEntity.ok(policies);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to retrieve insurance policies");
        }
    }
}
