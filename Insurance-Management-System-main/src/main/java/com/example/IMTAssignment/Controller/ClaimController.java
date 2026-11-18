
package com.example.IMTAssignment.Controller;

import com.example.IMTAssignment.DTOs.ClaimDto;
import com.example.IMTAssignment.DTOs.ClaimResponse.ClaimResponseDto;
import com.example.IMTAssignment.DTOs.ClaimUpdateReqDto;
import com.example.IMTAssignment.Models.UserInfo;
import com.example.IMTAssignment.Repository.UserInfoRepository;
import com.example.IMTAssignment.Service.ClaimService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claim")
public class ClaimController {

    @Autowired
    ClaimService claimService;

    @Autowired
    UserInfoRepository userInfoRepository;

    // ADD CLAIM - ADMIN
    @PostMapping("/add")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> addClaim(@RequestBody ClaimDto claimDto) {
        try {
            String result = claimService.addClaim(claimDto);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    // CLIENT SUBMIT CLAIM
    @PostMapping("/client-submit")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> submitClientClaim(
            @RequestBody ClaimDto claimDto,
            Authentication authentication) {

        try {
            UserInfo userInfo = userInfoRepository
                    .findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userInfo.getClient() == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Client account not linked");
            }

            Integer clientId = userInfo.getClient().getId();

            String result = claimService.addClientClaim(clientId, claimDto);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET CLAIM BY ID
    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getClaimById(@PathVariable Integer id) {
        try {
            ClaimResponseDto dto = claimService.getClaimById(id);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "please check claim id!!!", HttpStatus.BAD_REQUEST);
        }
    }

    // GET ALL CLAIMS - ADMIN
    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllClaims() {
        try {
            List<ClaimResponseDto> list = claimService.getAllClaims();
            return new ResponseEntity<>(list, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "claim list not found!!!!", HttpStatus.NOT_FOUND);
        }
    }

    // DELETE CLAIM - ADMIN
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteClaim(@PathVariable Integer id) {
        try {
            String result = claimService.deleteClaim(id);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "error occurred while deleting claim",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // UPDATE CLAIM - ADMIN
    @PutMapping("/edit/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateClaim(
            @PathVariable Integer id,
            @RequestBody ClaimUpdateReqDto claimUpdateReqDto) {

        try {
            String result = claimService.updateClaim(id, claimUpdateReqDto);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(
                    "error occurred while updating claim!!!!",
                    HttpStatus.BAD_REQUEST);
        }
    }

    // GET CLAIMS OF LOGGED-IN CLIENT
    @GetMapping("/my-claims")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<?> getMyClaims(Authentication authentication) {
        try {
            UserInfo userInfo = userInfoRepository
                    .findByUsername(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (userInfo.getClient() == null) {
                return ResponseEntity.notFound().build();
            }

            Integer clientId = userInfo.getClient().getId();

            List<ClaimResponseDto> claims =
                    claimService.getClaimsByClient(clientId);

            return ResponseEntity.ok(claims);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Unable to retrieve client claims");
        }
    }
}
