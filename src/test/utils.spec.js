import {sortTasks, compareStories, comparePriorities, compareTaskIDs }from '../utils/compare-story-helper';

describe.skip('Priorities', () => {
  it('are sorter from higher to lower', () => {
    expect([{priority: 1}, {priority: 2}].sort(comparePriorities)
    ).to.deep.equal([{priority: 2}, {priority: 1}]);
  });

  it('are sorter from defined to undefined', () => {
    expect([{priority: 1}, {}].sort(comparePriorities)
    ).to.deep.equal([{priority: 1 }, {}]);

    expect([{}, {priority: 1}].sort(comparePriorities)
    ).to.deep.equal([{priority: 1 }, {}]);
  });

  it('equal are not sorted', () => {
    expect([{priority: 9, a: 1}, {priority: 9, a: 2}])
      .to.deep.equal([{priority: 9, a: 1}, {priority: 9, a: 2}]);
  });
});

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
    console.log([{priority: 4, id: 'Z'}, {priority: 9, id: 'A'}])
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

describe.skip('Stories', () => {
  it('are sorted A-Z', () => {
    expect([{story: 'B'}, {story: 'A'}].sort(compareStories))
      .to.deep.equal([{story: 'A'}, {story: 'B'}]);
  });

  it('are sorter from defined to undefined', () => {
    expect([{}, {story: 'A'}].sort(compareStories))
      .to.deep.equal([{story: 'A'}, {}]);
    expect([{story: 'A'}, {}].sort(compareStories))
      .to.deep.equal([{story: 'A'}, {}]);
  });

  it('equal are not sorted', () => {
    expect([{story: 'A', anotherKey: 'B'}, {story: 'A', anotherKey: 'A'}].sort(compareStories))
      .to.deep.equal([{story: 'A', anotherKey: 'B'}, {story: 'A', anotherKey: 'A'}]);
  });
});

describe.skip('IDs', () => {
  it('are sorted A-Z', () => {
    expect([{id: 'B'}, {id: 'A'}].sort(compareTaskIDs))
      .to.deep.equal([{id: 'A'}, {id: 'B'}]);
  });

  it('are sorter from defined to undefined', () => {
    expect([{}, {id: 'A'}].sort(compareTaskIDs))
      .to.deep.equal([{id: 'A'}, {}]);
    expect([{id: 'A'}, {}].sort(compareTaskIDs))
      .to.deep.equal([{id: 'A'}, {}]);
  });

  it('equal are not sorted', () => {
    expect([{id: 'A', anotherKey: 'B'}, {id: 'A', anotherKey: 'A'}].sort(compareTaskIDs))
      .to.deep.equal([{id: 'A', anotherKey: 'B'}, {id: 'A', anotherKey: 'A'}]);
  });
});
