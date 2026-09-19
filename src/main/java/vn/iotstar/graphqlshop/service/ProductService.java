package vn.iotstar.graphqlshop.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.iotstar.graphqlshop.entity.Category;
import vn.iotstar.graphqlshop.entity.Product;
import vn.iotstar.graphqlshop.graphql.ProductInput;
import vn.iotstar.graphqlshop.repository.CategoryRepository;
import vn.iotstar.graphqlshop.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> findAllByPriceAsc() {
        return productRepository.findAllByOrderByPriceAsc();
    }

    public List<Product> findByCategory(Long categoryId) {
        return productRepository.findByCategoryIdOrderByPriceAsc(categoryId);
    }

    public PageResult<Product> search(String keyword, int page, int size) {
        String key = keyword == null ? "" : keyword.trim();
        int safePage = Math.max(page, 0);
        int safeSize = size <= 0 ? 5 : Math.min(size, 100);
        Page<Product> result = productRepository.findByNameContainingIgnoreCase(
                key, PageRequest.of(safePage, safeSize, Sort.by("id").descending()));
        return new PageResult<>(result.getContent(), (int) result.getTotalElements(), result.getTotalPages(), safePage, safeSize);
    }

    @Transactional
    public Product create(ProductInput input) {
        Product product = new Product();
        apply(product, input);
        return productRepository.save(product);
    }

    @Transactional
    public Product update(Long id, ProductInput input) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
        apply(product, input);
        return productRepository.save(product);
    }

    @Transactional
    public boolean delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Không tìm thấy sản phẩm");
        }
        productRepository.deleteById(id);
        return true;
    }

    private void apply(Product product, ProductInput input) {
        if (input.name() == null || input.name().trim().isEmpty()) {
            throw new IllegalArgumentException("Tên sản phẩm không được để trống");
        }
        if (input.price() == null || input.price() < 0) {
            throw new IllegalArgumentException("Giá sản phẩm không hợp lệ");
        }
        product.setName(input.name().trim());
        product.setPrice(input.price());
        product.setDescription(input.description());
        Category category = null;
        if (input.categoryId() != null && !input.categoryId().isBlank()) {
            Long categoryId = Long.valueOf(input.categoryId());
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại"));
        }
        product.setCategory(category);
    }
}
