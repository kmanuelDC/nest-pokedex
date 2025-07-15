import { Injectable } from '@nestjs/common';
//import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  //private readonly axios: AxiosInstance = axios;

  /*   constructor() {
      this.axios = axios.create(); // <--- INICIALIZACIÓN AQUÍ
    } */
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({});

    //const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemontoInsert: { name: string, number: number }[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const number = +segments[segments.length - 2];

      pokemontoInsert.push({ name, number });
    });

    this.pokemonModel.insertMany(pokemontoInsert);

    return 'seed executed';
  }
}
