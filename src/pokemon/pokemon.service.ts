import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PokemonModule } from './pokemon.module';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExeption(error);
    }
  }

  async findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    try {
      let pokemon: Pokemon | null = null;
      if (!isNaN(+term)) {
        pokemon = await this.pokemonModel.findOne({ number: term });
      }

      //MongoDB
      if (isValidObjectId(term)) {
        pokemon = await this.pokemonModel.findById(term);
      }
      if (!pokemon) {
        pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() });
      }
      if (!pokemon) throw new NotFoundException(`Pokemon ${term} not found`);
      return pokemon;
    } catch (error) {
      this.handleExeption(error);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne(term);

      if (updatePokemonDto?.name) {
        //console.log(updatePokemonDto?.name);
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }
      await pokemon?.updateOne(updatePokemonDto);
      return { ...pokemon?.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExeption(error);
    }
  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    //await pokemon?.deleteOne();
    //return { id };
    //await pokemon.();
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new NotFoundException(`Pokemon ${id} not found`);
    return { message: `Pokemon ${id} deleted` };
  }

  private handleExeption(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(error.message);
    }
    console.error(error);
    throw new InternalServerErrorException(`Internal server error: ${error}`);
  }
}

