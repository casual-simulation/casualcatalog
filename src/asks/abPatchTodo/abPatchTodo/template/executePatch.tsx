await ab.links.todo.abPatchApply(thisBot);

await os.sleep(0); // NOTE: Need to wait 1 frame and let tags/masks updates in the patch bots otherwise the menu wont be able to retrieve all patch bots successfully.
