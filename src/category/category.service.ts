import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    let new_category = new Category();

    new_category.name = name;

    const addingCategory = await this.categoryRepository.save(new_category);

    return {
      Message: 'Success',
      Data: addingCategory,
    };
  }

  async findAll() {
    const find_category = await this.categoryRepository.find();

    return {
      Message: 'Success',
      Data: find_category,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const find = await this.categoryRepository.findOne({
      where: {
        id: id,
      },
    });
    if (find) {
      await this.categoryRepository.update(id, updateCategoryDto);
      return {Message:"Update successfull"}
    }

    return 'Category does not exist';
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
