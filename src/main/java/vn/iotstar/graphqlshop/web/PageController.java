package vn.iotstar.graphqlshop.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String home() {
        return "home";
    }

    @GetMapping("/admin/products")
    public String products() {
        return "admin/products";
    }

    @GetMapping("/admin/categories")
    public String categories() {
        return "admin/categories";
    }
}
