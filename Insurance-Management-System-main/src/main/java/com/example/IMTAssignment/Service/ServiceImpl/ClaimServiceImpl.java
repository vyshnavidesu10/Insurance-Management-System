
package com.example.IMTAssignment.Service.ServiceImpl;

import com.example.IMTAssignment.DTOs.ClaimDto;
import com.example.IMTAssignment.DTOs.ClaimResponse.ClaimResponseDto;
import com.example.IMTAssignment.DTOs.ClaimResponse.InsuranceResponseForClaimDto;
import com.example.IMTAssignment.DTOs.ClaimUpdateReqDto;

import com.example.IMTAssignment.Enum.ClaimStatus;

import com.example.IMTAssignment.Models.Claim;
import com.example.IMTAssignment.Models.InsurancePolicy;

import com.example.IMTAssignment.Repository.ClaimRepository;
import com.example.IMTAssignment.Repository.InsuranceRepository;

import com.example.IMTAssignment.Service.ClaimService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClaimServiceImpl implements ClaimService {

    @Autowired
    private InsuranceRepository insuranceRepository;

    @Autowired
    private ClaimRepository claimRepository;

    // COMMON METHOD TO CONVERT CLAIM INTO RESPONSE DTO
    private ClaimResponseDto convertToDto(Claim claim) {

        ClaimResponseDto dto = new ClaimResponseDto();

        dto.setId(claim.getId());
        dto.setNumber(claim.getNumber());
        dto.setDescription(claim.getDescription());
        dto.setClaimDate(claim.getClaimDate());
        dto.setClaimStatus(claim.getClaimStatus());

        InsurancePolicy policy = claim.getInsurancePolicy();

        if (policy != null) {

            if (policy.getClient() != null) {
                dto.setCustomerName(policy.getClient().getName());
            }

            InsuranceResponseForClaimDto insuranceDto =
                    new InsuranceResponseForClaimDto();

            insuranceDto.setPolicyNumber(policy.getPolicyNumber());
            insuranceDto.setInsuranceType(policy.getType());
            insuranceDto.setCoverageAmount(policy.getCoverageAmount());
            insuranceDto.setPremium(policy.getPremium());
            insuranceDto.setStartDate(policy.getStartDate());
            insuranceDto.setEndDate(policy.getEndDate());

            dto.setInsuranceResponseForClaimDto(insuranceDto);
        }

        return dto;
    }

    // ADMIN: ADD CLAIM
    @Override
    @Transactional
    public String addClaim(ClaimDto claimDto) throws Exception {

        InsurancePolicy insurancePolicy =
                insuranceRepository.findByPolicyNumber(
                        claimDto.getPolicyNumber());

        if (insurancePolicy == null) {
            throw new Exception("Insurance policy not found: "
                    + claimDto.getPolicyNumber());
        }

        Claim claim = new Claim();

        claim.setNumber(claimDto.getNumber());
        claim.setDescription(claimDto.getDescription());
        claim.setClaimDate(claimDto.getClaimDate());
        claim.setClaimStatus(claimDto.getClaimStatus());

        // Link claim to insurance policy
        insurancePolicy.addClaim(claim);

        // Save claim
        claimRepository.save(claim);

        return "Claim request added successfully";
    }

    // GET CLAIM BY ID
    @Override
    @Transactional(readOnly = true)
    public ClaimResponseDto getClaimById(Integer id) throws Exception {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new Exception("Claim not found"));

        return convertToDto(claim);
    }

    // GET ALL CLAIMS - ADMIN
    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponseDto> getAllClaims() throws Exception {

        List<Claim> claimList = claimRepository.findAll();

        List<ClaimResponseDto> responseList = new ArrayList<>();

        for (Claim claim : claimList) {
            responseList.add(convertToDto(claim));
        }

        return responseList;
    }

    // DELETE CLAIM
    @Override
    @Transactional
    public String deleteClaim(Integer id) throws Exception {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new Exception("Claim not found"));

        claimRepository.delete(claim);
        claimRepository.flush();

        boolean exists = claimRepository.existsById(id);

        if (exists) {
            throw new Exception("Claim was not deleted");
        }

        return "Claim deleted successfully";
    }

    // UPDATE CLAIM
    @Override
    @Transactional
    public String updateClaim(
            Integer id,
            ClaimUpdateReqDto claimUpdateReqDto) throws Exception {

        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new Exception("Claim not found"));

        claim.setDescription(claimUpdateReqDto.getDescription());
        claim.setClaimStatus(claimUpdateReqDto.getClaimStatus());
        claim.setClaimDate(claimUpdateReqDto.getClaimDate());

        claimRepository.save(claim);

        return "Claim updated successfully";
    }

    // GET CLAIMS OF LOGGED-IN CLIENT
    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponseDto> getClaimsByClient(Integer clientId)
            throws Exception {

        List<Claim> claimList =
                claimRepository.findByInsurancePolicyClientId(clientId);

        List<ClaimResponseDto> responseList = new ArrayList<>();

        for (Claim claim : claimList) {
            responseList.add(convertToDto(claim));
        }

        return responseList;
    }

    // CLIENT: SUBMIT OWN CLAIM
    @Override
    @Transactional
    public String addClientClaim(Integer clientId, ClaimDto claimDto)
            throws Exception {

        // Find insurance policy
        InsurancePolicy insurancePolicy =
                insuranceRepository.findByPolicyNumber(
                        claimDto.getPolicyNumber());

        if (insurancePolicy == null) {
            throw new Exception("Insurance policy not found");
        }

        // Verify policy belongs to logged-in client
        if (insurancePolicy.getClient() == null ||
                insurancePolicy.getClient().getId() != clientId) {

            throw new Exception(
                    "You cannot submit a claim for another client's policy");
        }

        // Validate description
        if (claimDto.getDescription() == null ||
                claimDto.getDescription().trim().isEmpty()) {

            throw new Exception("Claim description is required");
        }

        // Validate claim date
        if (claimDto.getClaimDate() == null) {
            throw new Exception("Claim date is required");
        }

        // Create new claim
        Claim claim = new Claim();

        // Generate unique claim number
        claim.setNumber("CLM" + System.currentTimeMillis());

        claim.setDescription(claimDto.getDescription());
        claim.setClaimDate(claimDto.getClaimDate());

        // Default claim status
        claim.setClaimStatus(ClaimStatus.Under_Process);

        // Link claim to insurance policy
        insurancePolicy.addClaim(claim);

        // Save new claim
        claimRepository.save(claim);

        return "Claim submitted successfully. Status: Under_Process";
    }
}
