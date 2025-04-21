package com.taskmanager.backend.resources;

import com.taskmanager.backend.model.User;
import com.taskmanager.backend.services.UserService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/task-manager/users")
public class UserResource {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> findAll() {
        List<User> list = userService.findAll();
        return ResponseEntity.ok().body(list);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<User> findById(@PathVariable Integer id) {
        User obj = userService.findById(id);
        return ResponseEntity.ok().body(obj);
    }

    @PostMapping
    public ResponseEntity<User> insert(@RequestBody User obj) {
        User newObj = userService.insert(obj);
        return ResponseEntity.ok().body(newObj);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<User> update(@RequestBody User obj, @PathVariable Integer id) {
        obj = userService.update(obj, id);
        return ResponseEntity.ok().body(obj);
    }

    @PatchMapping(value = "/{id}")
    public ResponseEntity<User> patchPassword(@PathVariable Integer id, @RequestBody Map<String, Object> updates) {
        User obj = userService.findById(id);

        if (updates.containsKey("password")) {
            obj.setPassword((String) updates.get("password"));
        }

        User newObj = userService.save(obj);
        return ResponseEntity.ok().body(newObj);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<User> deleteById(@PathVariable Integer id) {
        User obj = userService.findById(id);
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
