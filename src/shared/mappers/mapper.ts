export abstract class Mapper<From, To> {
  abstract map(from: From): To;

  abstract reverse(from: To): From;

  mapAll(froms: From[]): To[] {
    return froms.map((from) => this.map(from));
  }

  reverseAll(froms: To[]): From[] {
    return froms.map((from) => this.reverse(from));
  }
}

export abstract class EntityModelMapper<Entity, Model> {
  abstract toModel(from: Entity): Model;

  abstract toEntity(from: Model): Entity;
}
