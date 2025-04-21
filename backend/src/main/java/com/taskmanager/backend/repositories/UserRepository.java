package com.taskmanager.backend.repositories;

import com.taskmanager.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
