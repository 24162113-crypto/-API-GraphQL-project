package vn.iotstar.graphqlshop.graphql;

import java.util.List;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import vn.iotstar.graphqlshop.entity.Category;
import vn.iotstar.graphqlshop.service.CategoryService;
import vn.iotstar.graphqlshop.service.PageResult;

@Controller
public class CategoryGraphQlController {

    private final CategoryService categoryService;

    public CategoryGraphQlController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @QueryMapping
    public List<Category> categories() {
        return categoryService.findAll();
    }

    @QueryMapping
    public Category category(@Argument Long id) {
        return categoryService.findById(id);
    }

    @QueryMapping
    public PageResult<Category> searchCategories(@Argument String keyword, @Argument int page, @Argument int size) {
        return categoryService.search(keyword, page, size);
    }

    @MutationMapping
    public Category createCategory(@Argument CategoryInput input) {
        return categoryService.create(input.name());
    }

    @MutationMapping
    public Category updateCategory(@Argument Long id, @Argument CategoryInput input) {
        return categoryService.update(id, input.name());
    }

    @MutationMapping
    public boolean deleteCategory(@Argument Long id) {
        return categoryService.delete(id);
    }
}
