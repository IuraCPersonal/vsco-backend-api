import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { CreateProductDto } from 'src/modules/products/dto/createProduct.dto';
import { Product } from 'src/schemas/product.schema';

export class ProductsRepository {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) { }

  async createProduct(
    createProductDto: CreateProductDto,
    session: ClientSession,
  ) {
    let product = new this.productModel({
      name: createProductDto.name,
      price: createProductDto.price,
      image: createProductDto.image,
      colors: createProductDto.colors,
      company: createProductDto.company,
      description: createProductDto.description,
      category: createProductDto.category,
      shipping: createProductDto.shipping,
    });

    try {
      product = await product.save({ session });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    if (!product) {
      throw new ConflictException('product Was Not Created.');
    }

    return product;
  }

  async getProducts() {
    let products: Array<any>;

    try {
      products = await this.productModel.find({}).exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return products;
  }
}
