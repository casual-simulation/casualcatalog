const data = JSON.parse(that.data);

//get grid data
if (!ab.links.remember.tags.abGridFocus) {
  const gridData = {
      dimension: abRemember.tags.abActiveDimension ?? 'home', 
      position: {
          x: 0,
          y: 0
      }
  }
  ab.links.remember.tags.abGridFocus = gridData;
}

//make sure the ask is there
if (data && data.ask) {

  //If pulling a toolbox
  if (data.ask.includes("toolbox")) {
    const toolboxData = ab.links.remember.tags.toolbox_array.find(toolBox => toolBox.name == data.ask);
    links.manager.toolbox_add({toolboxData: toolboxData, gridData: ab.links.remember.tags.abGridFocus});
  } 
  //else pulling artifact or ask
  else {
    let isArtifact = false;

    //find the toolbox for this ask, to determine if its an artifact
    const toolbox = getBot(byTag("tool_array", tool_arr => {
      if (tool_arr.find(tool => tool.targetAB == data.ask)) {
        return true;
      }}
    ));
    if (toolbox) {
      isArtifact = toolbox.tags.tool_array.find(tool => tool.targetAB == data.ask)?.artifact;
    }

    //is artifact
    if (isArtifact) {
      const abArtifactShard = {
          data: {
              eggParameters: {
                  toolboxBot: null,
                  gridInformation: ab.links.remember.tags.abGridFocus
              }
          },
          dependencies: [
              {
                  askID: data.ask
              }
          ]
      };
      ab.links.artifact.abCreateArtifactPromiseBot({
          abArtifactName: data.ask,
          abArtifactInstanceID: uuid(),
          abArtifactShard,
      });
      shout("abMenuRefresh");
      thisBot.sendToolCompleteMessage({id: that.id});
    } 
    //is not artifact
    else {
      const response = ab.links.search.onLookupAskID({
          askID: data.ask,
          sourceEvent: 'tool',
          eggParameters: {
              toolboxBot: null,
              gridInformation: ab.links.remember.tags.abGridFocus
          },
      });
      shout("abMenuRefresh");
      if (response.success) {
        thisBot.sendToolCompleteMessage({id: that.id});
      } else {
        thisBot.sendToolCompleteMessage({id: that.id, content: "failed"});
      }
    }
  }
}