import { IProjectRepository } from './IProject.repository';
import { Project } from './Project.entity';

export class ProjectRepository implements IProjectRepository {
  save(data: Project): Promise<Project> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<Project[]> {
    throw new Error('Method not implemented.');
  }
  findOne(id: string): Promise<Project> {
    throw new Error('Method not implemented.');
  }
}
