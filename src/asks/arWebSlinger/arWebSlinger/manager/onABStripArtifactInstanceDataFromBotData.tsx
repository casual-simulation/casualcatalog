console.log(`[${tags.system}.${tagName}]`, JSON.parse(JSON.stringify(that)));

const { data } = that;

const dimension = data.tags.dimension;

delete data.tags.dimension;
delete data.tags[dimension];
delete data.tags[dimension + 'X'];
delete data.tags[dimension + 'Y'];
delete data.tags[dimension + 'Z'];