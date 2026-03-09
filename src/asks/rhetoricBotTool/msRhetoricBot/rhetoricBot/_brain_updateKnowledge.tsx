let knowledgeBase = tags.knowledgeBase ?? [];
knowledgeBase = JSON.parse(JSON.stringify(knowledgeBase));

let {
  add,
  update,
  merge,
  remove
} = that || {};

console.log("knowledgeBase:", knowledgeBase);

knowledgeBase.push(...add); // adds new neurons

knowledgeBase = updateMatchingObjects(knowledgeBase, update); // updates existing neurons

// merges neurons, marks the ones being merged for removal
for (const mergedNeuron of merge) {
  let newName = mergedNeuron.newName;
  let topicsToMerge = mergedNeuron.topicsToMerge;
  let mergedDetails = "";
  let stemConnected = false;
  let connections = [];

  for (const index in knowledgeBase) {
    let neuron = knowledgeBase[index];
    if (topicsToMerge.includes(neuron.topic)) {
      mergedDetails.length == 0 ? null : mergedDetails += " ";
      mergedDetails += neuron.details;
      neuron.stemConnected == true ? stemConnected = true : null;
      connections.push(...neuron.linkedTopics);
    }

    neuron.linkedTopics = replaceArrayOverlaps(neuron.linkedTopics, topicsToMerge, newName);

  }

  connections = connections.filter(e => !topicsToMerge.includes(e));
  connections = [...new Set(connections)];

  knowledgeBase.push({
    "topic": newName,
    "linkedTopics": connections,
    "stemConnected": stemConnected,
    "details": mergedDetails
  })

  remove.push(...topicsToMerge)
}

knowledgeBase = knowledgeBase.filter(e => !remove.includes(e.topic)); //removes topics in the remove array

// cleans up neuron linkedTopics properties of removed neurons
for (const neuron of knowledgeBase) {
  neuron.linkedTopics = neuron.linkedTopics.filter(e => !remove.includes(e))
}

tags.knowledgeBase = knowledgeBase; // updates the knowledge base with final array

// finds overlaps between arr1 and arr2 and replaces them in arr1 with the provided newValue
function replaceArrayOverlaps(arr1, arr2, newValue) {
  const overlap = arr1.filter(v => arr2.includes(v));
  const replaced = arr1.map(v => overlap.includes(v) ? newValue : v);
  return [...new Set(replaced)];
}

// updates the details of the neurons
function updateMatchingObjects(targetArray, updatesArray, matchKey = "topic", updateKey = "details", targetProp = "details") {
  const updatesMap = new Map(updatesArray.map(obj => [obj[matchKey], obj[updateKey]]));

  return targetArray.map(obj => {
    if (updatesMap.has(obj[matchKey])) {
      return { ...obj, [targetProp]: updatesMap.get(obj[matchKey]) };
    }
    return obj;
  });
}

let neuronBots = getBots(byTag("system", "msRhetoricBot.neuron"));
if (neuronBots.length > 0) {
  shout("removeNeuronBots");
  thisBot._brain_createFGBNeurons();
}