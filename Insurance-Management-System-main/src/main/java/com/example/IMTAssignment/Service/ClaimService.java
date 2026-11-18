
package com.example.IMTAssignment.Service;

import com.example.IMTAssignment.DTOs.ClaimDto;
import com.example.IMTAssignment.DTOs.ClaimResponse.ClaimResponseDto;
import com.example.IMTAssignment.DTOs.ClaimUpdateReqDto;

import java.util.List;

public interface ClaimService {

    // ADMIN: ADD CLAIM
    String addClaim(ClaimDto claimDto) throws Exception;

    // GET CLAIM BY ID
    ClaimResponseDto getClaimById(Integer id) throws Exception;

    // GET ALL CLAIMS
    List<ClaimResponseDto> getAllClaims() throws Exception;

    // DELETE CLAIM
    String deleteClaim(Integer id) throws Exception;

    // UPDATE CLAIM
    String updateClaim(
        Integer id,
        ClaimUpdateReqDto claimUpdateReqDto
    ) throws Exception;

    // GET CLAIMS BY CLIENT
    List<ClaimResponseDto> getClaimsByClient(Integer clientId)
        throws Exception;

    // CLIENT: SUBMIT OWN CLAIM
    String addClientClaim(Integer clientId, ClaimDto claimDto)
        throws Exception;
}
