package com.taskmanager.backend.resources;

import com.taskmanager.backend.dto.TaskDTO;
import com.taskmanager.backend.model.Task;
import com.taskmanager.backend.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/task-manager/tasks")
public class TaskResource {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> findAll() {
        List<TaskDTO> list = taskService.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<Task> findById(@PathVariable Integer id) {
        Task obj = taskService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<Task> insert(@RequestBody TaskDTO dto) {
        Task obj = taskService.insert(dto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(obj.getId())
                .toUri();
        return ResponseEntity.created(uri).body(obj);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Task> update(@PathVariable Integer id, @RequestBody TaskDTO dto) {
        Task obj = taskService.update(id, dto);
        return ResponseEntity.ok().body(obj);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<Task> patch(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        Task obj = taskService.findById(id);

        if (updates.containsKey("status")) {
            obj.setStatus((Integer) updates.get("status"));
        }

        Task newObj = taskService.save(obj);
        return ResponseEntity.ok().body(newObj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Task> deleteById(@PathVariable Integer id) {
        taskService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
