package vn.iotstar.graphqlshop.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import vn.iotstar.graphqlshop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByOrderByPriceAsc();

    List<Product> findByCategoryIdOrderByPriceAsc(Long categoryId);

    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);

    boolean existsByCategoryId(Long categoryId);
}
