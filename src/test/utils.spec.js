import { sortTasks } from '../utils/compare-story-helper';

describe('Tasks', () => {
  it('are sorted by story(A-Z), priority(Z-A), id(A-Z)', () => {
    expect(sortTasks([{story: 'B'}, {story: 'A'}]))
      .to.deep.equal([{story: 'A'}, {story: 'B'}]);

    expect(sortTasks([{story: 'B', priority: 4}, {story: 'B', priority: 5}]))
      .to.deep.equal([{story: 'B', priority: 5}, {story: 'B', priority: 4}]);

    expect(sortTasks([{story: 'B', priority: 4, id: 'Z'}, {story: 'B', priority: 4, id: 'A'}]))
      .to.deep.equal([{story: 'B', priority: 4, id: 'A'}, {story: 'B', priority: 4, id: 'Z' }]);
  });

  it('compare specific', () => {
    expect(sortTasks([{priority: 4, id: 'Z'}, {priority: 9, id: 'A'}]))
      .to.deep.equal([{priority: 9, id: 'A'}, {priority: 4, id: 'Z' }]);
  });

  it('are sorted story (ASC), priority(DESC), id(ASC)', () => {
    const tasks = [
      {
        id: '4',
        story: '2',
        priority: 7,
      }, {
        id: '5',
        story: '2',
        priority: 8,
      }, {
        id: '6',
        story: '1',
        priority: 2,
      }, {
        id: '3',
        story: '1',
        priority: 4,
      },
    ];
    const sortedTasks = sortTasks(tasks);
    expect(sortedTasks).to.deep.equal([
      {
        id: '3',
        story: '1',
        priority: 4,
      }, {
        id: '6',
        story: '1',
        priority: 2,
      }, {
        id: '5',
        story: '2',
        priority: 8,
      }, {
        id: '4',
        story: '2',
        priority: 7,
      },
    ]);
  });
});
