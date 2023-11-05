import { IProjectRepository } from './IProject.repository';
import { Project } from './Project.entity';
import { Task } from './Task.entity';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) { }

  // findAll(): Promise<Project[]> {
  //   return this.projectRepo.find();
  // }

  // findOne(id: string): Promise<Project> {
  //   return this.projectRepo.findOneOrFail({ where: { id } });
  // }

  create(props: {
    name: string;
    description: string;
    started_at?: Date | null;
    forecasted_at?: Date | null;
  }) {
    const project = Project.create({
      name: props.name,
      description: props.description,
      started_at: props.started_at,
      forecasted_at: props.forecasted_at,
    });
    return this.projectRepository.save(project);
  }

  async start(id: string, started_at: Date) {
    const project = await this.projectRepository.findOne(id);
    project.start(started_at);
    return this.projectRepository.save(project);
  }

  async cancel(id: string, cancelled_at: Date) {
    const project = await this.projectRepository.findOne(id);
    project.cancel(cancelled_at);
    return this.projectRepository.save(project);
  }

  async complete(id: string, finished_at: Date) {
    const project = await this.projectRepository.findOne(id);
    project.complete(finished_at);
    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    props: {
      name?: string;
      description?: string;
      forecasted_at?: Date | null;
    },
  ) {
    const project = await this.projectRepository.findOne(id);
    props.name && project.changeName(props.name);
    props.description && project.changeDescription(props.description);
    props.forecasted_at && project.changeForecastedDate(props.forecasted_at);
    return this.projectRepository.save(project);
  }

  async addTask(props: {
    project_id: string;
    name: string;
    description: string;
    started_at?: Date | null;
    finished_at?: Date | null;
    forecasted_at?: Date | null;
  }) {
    const project = await this.projectRepository.findOne(props.project_id);
    const task = Task.create({
      name: props.name,
      description: props.description,
      started_at: props.started_at,
      finished_at: props.finished_at,
      forecasted_at: props.forecasted_at,
    });
    project.addTask(task);
    await this.projectRepository.save(project);
    return task;
  }

  async startTask(project_id: string, task_id: string, started_at: Date) {
    const project = await this.projectRepository.findOne(project_id);
    const task = project.tasks.find((task) => task.id === task_id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.start(started_at);
    await this.projectRepository.save(project);
    return task;
  }

  async cancelTask(project_id: string, task_id: string, cancelled_at: Date) {
    const project = await this.projectRepository.findOne(project_id);
    const task = project.tasks.find((task) => task.id === task_id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.cancel(cancelled_at);
    await this.projectRepository.save(project);
    return task;
  }

  async completeTask(project_id: string, task_id: string, finished_at: Date) {
    const project = await this.projectRepository.findOne(project_id);
    const task = project.tasks.find((task) => task.id === task_id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.complete(finished_at);
    await this.projectRepository.save(project);
    return task;
  }

  async updateTask(
    project_id: string,
    task_id: string,
    props: {
      name?: string;
      description?: string;
      forecasted_at?: Date | null;
    },
  ) {
    const project = await this.projectRepository.findOne(project_id);
    const task = project.tasks.find((task) => task.id === task_id);
    if (!task) {
      throw new Error('Task not found');
    }
    props.name && task.changeName(props.name);
    props.description && task.changeDescription(props.description);
    props.forecasted_at && task.changeForecastedDate(props.forecasted_at);
    await this.projectRepository.save(project);
    return task;
  }
}
