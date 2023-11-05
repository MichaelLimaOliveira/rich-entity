import { Project } from './Project.entity';

export abstract class IProjectRepository {
  abstract findAll(): Promise<Project[]>;
  abstract findOne(id: string): Promise<Project>;
  abstract save(data: Project): Promise<Project>;
}
