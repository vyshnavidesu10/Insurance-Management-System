
package com.example.IMTAssignment.Repository;

import com.example.IMTAssignment.Models.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceRepository extends JpaRepository<InsurancePolicy, Integer> {

    InsurancePolicy findByPolicyNumber(String policyNumber);

    List<InsurancePolicy> findByClientId(int clientId);
}
