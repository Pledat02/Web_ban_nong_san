package com.example.Identity_Service.repository;

import com.example.Identity_Service.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface PermissionRepository extends JpaRepository<Permission,String> {

    public Permission findByName(String name);

    @Query("select Permission from Permission where name in :permissions ")
    public List<Permission> getAllPermissionById(@Param("permissions") Set<String> permissionsName);
}
