package vn.iotstar.graphqlshop.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.iotstar.graphqlshop.entity.Category;
import vn.iotstar.graphqlshop.repository.CategoryRepository;
import vn.iotstar.graphqlshop.repository.ProductRepository;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategoryService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<Category> findAll() {
        return categoryRepository.findAll(Sort.by("name"));
    }

    public Category findById(Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public PageResult<Category> search(String keyword, int page, int size) {
        String key = keyword == null ? "" : keyword.trim();
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 5 : Math.min(size, 100);
        Page<Category> result = categoryRepository.findByNameContainingIgnoreCase(
                key, PageRequest.of(safePage, safeSize, Sort.by("id").descending()));
        return new PageResult<>(result.getContent(), (int) result.getTotalElements(), result.getTotalPages(), safePage, safeSize);
    }

    @Transactional
    public Category create(String name) {
        Category category = new Category();
        category.setName(validName(name));
        return categoryRepository.save(category);
    }

    @Transactional
    public Category update(Long id, String name) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));
        category.setName(validName(name));
        return categoryRepository.save(category);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy danh mục");
        }
        if (productRepository.existsByCategoryId(id)) {
            throw new IllegalArgumentException("Danh mục đang có sản phẩm, không thể xóa");
        }
        categoryRepository.deleteById(id);
        return true;
    }

    private String validName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Tên danh mục không được để trống");
        }
        return name.trim();
    }
}
