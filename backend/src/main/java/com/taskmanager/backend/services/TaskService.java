package com.taskmanager.backend.services;

import com.taskmanager.backend.dto.TaskDTO;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.model.User;
import com.taskmanager.backend.repositories.TaskRepository;
import com.taskmanager.backend.repositories.UserRepository;
import com.taskmanager.backend.services.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public List<TaskDTO> findAll() {
        List<Task> tasks = taskRepository.findAll();
        return tasks.stream().map(TaskDTO::new).collect(Collectors.toList());
    }

    public Task findById(Integer id) {
        Optional<Task> obj = taskRepository.findById(id);
        return obj.orElseThrow(() -> new ResourceNotFoundException(id));
    }

    public Task insert(TaskDTO dto) {
        User objUser = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(dto.getUserId()));
        Task obj = new Task(null, dto.getTitle(), dto.getDescription(), dto.getStatus(), objUser);
        return save(obj);
    }

    public Task update(Integer id, TaskDTO dto) {
        Task obj = taskRepository.getReferenceById(id);
        updateData(obj, dto);
        return save(obj);
    }

    public void updateData(Task obj, TaskDTO dto) {
        obj.setTitle(dto.getTitle());
        obj.setDescription((dto.getDescription()));
        obj.setStatus(dto.getStatus());
        obj.setUser(userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException(dto.getUserId())));
    }

    public void deleteById(Integer id) {
        taskRepository.deleteById(id);
    }

    public Task save(Task obj) {
        return taskRepository.save(obj);
    }
}
