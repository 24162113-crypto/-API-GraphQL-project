package vn.iotstar.graphqlshop.graphql;

import java.util.List;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import vn.iotstar.graphqlshop.entity.Product;
import vn.iotstar.graphqlshop.service.PageResult;
import vn.iotstar.graphqlshop.service.ProductService;

@Controller
public class ProductGraphQlController {

    private final ProductService productService;

    public ProductGraphQlController(ProductService productService) {
        this.productService = productService;
    }

    @QueryMapping
    public Product product(@Argument Long id) {
        return productService.findById(id);
    }

    @QueryMapping
    public List<Product> productsByPriceAsc() {
        return productService.findAllByPriceAsc();
    }

    @QueryMapping
    public List<Product> productsByCategory(@Argument Long categoryId) {
        return productService.findByCategory(categoryId);
    }

    @QueryMapping
    public PageResult<Product> searchProducts(@Argument String keyword, @Argument int page, @Argument int size) {
        return productService.search(keyword, page, size);
    }

    @MutationMapping
    public Product createProduct(@Argument ProductInput input) {
        return productService.create(input);
    }

    @MutationMapping
    public Product updateProduct(@Argument Long id, @Argument ProductInput input) {
        return productService.update(id, input);
    }

    @MutationMapping
    public boolean deleteProduct(@Argument Long id) {
        return productService.delete(id);
    }
}
