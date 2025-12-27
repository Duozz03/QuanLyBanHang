package com.deuoz.BackEnd.repository;

import com.deuoz.BackEnd.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByParentIsNull();
    boolean existsByName(String name);
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Category c SET c.quantity = c.quantity + :delta WHERE c.id = :id")
    int updateQuantity(@Param("id") Long id, @Param("delta") long quantity);
}
