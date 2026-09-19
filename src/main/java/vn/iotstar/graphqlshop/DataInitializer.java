package vn.iotstar.graphqlshop;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import vn.iotstar.graphqlshop.entity.Category;
import vn.iotstar.graphqlshop.entity.Product;
import vn.iotstar.graphqlshop.repository.CategoryRepository;
import vn.iotstar.graphqlshop.repository.ProductRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public DataInitializer(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }
        Category shirt = categoryRepository.save(new Category(null, "Áo"));
        Category pants = categoryRepository.save(new Category(null, "Quần"));
        Category shoes = categoryRepository.save(new Category(null, "Giày"));
        productRepository.saveAll(List.of(
                new Product(null, "Áo thun basic", 150000, "Áo thun cotton", shirt),
                new Product(null, "Áo sơ mi trắng", 320000, "Áo sơ mi công sở", shirt),
                new Product(null, "Áo khoác gió", 450000, "Áo khoác chống nước", shirt),
                new Product(null, "Quần jeans", 380000, "Quần jeans xanh", pants),
                new Product(null, "Quần short", 190000, "Quần short thể thao", pants),
                new Product(null, "Quần tây", 420000, "Quần tây đen", pants),
                new Product(null, "Giày sneaker", 690000, "Giày sneaker trắng", shoes),
                new Product(null, "Giày chạy bộ", 850000, "Giày chạy bộ nhẹ", shoes),
                new Product(null, "Dép sandal", 220000, "Dép sandal quai ngang", shoes)));
    }
}
