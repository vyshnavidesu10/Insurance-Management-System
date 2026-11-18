
package com.example.IMTAssignment.Repository;

import com.example.IMTAssignment.Models.Claim;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Integer> {

    // Get all claims belonging to a particular client
    List<Claim> findByInsurancePolicyClientId(int clientId);

    // Check whether a policy has any claims (optional method)
    boolean existsByInsurancePolicyId(Integer policyId);
}
