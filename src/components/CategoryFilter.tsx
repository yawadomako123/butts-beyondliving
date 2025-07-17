import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Button
        variant={selectedCategory === null ? "hero" : "outline"}
        onClick={() => onCategoryChange(null)}
        className="transition-all duration-200"
      >
        All Products
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "hero" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className="transition-all duration-200"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};