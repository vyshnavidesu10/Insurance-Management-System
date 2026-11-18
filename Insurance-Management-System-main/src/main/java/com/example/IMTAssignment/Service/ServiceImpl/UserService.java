
package com.example.IMTAssignment.Service.ServiceImpl;

import com.example.IMTAssignment.Models.UserInfo;
import com.example.IMTAssignment.Repository.UserInfoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    UserInfoRepository userInfoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String addUser(UserInfo userInfo) {

        // Check whether username already exists
        if (userInfoRepository.findByUsername(userInfo.getUsername()).isPresent()) {
            return "Username already exists";
        }

        // Encrypt password
        userInfo.setPassword(
            passwordEncoder.encode(userInfo.getPassword())
        );

        // Give normal users the USER role
        userInfo.setRole("ROLE_USER");

        userInfoRepository.save(userInfo);

        return "User added successfully";
    }
}
