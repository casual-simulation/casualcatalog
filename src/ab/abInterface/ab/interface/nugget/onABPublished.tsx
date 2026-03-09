console.log(that.ab, tags.nuggetToPublish)

if (that.ab == tags.nuggetToPublish)
{
    os.toast("nugget published");

    masks.nuggetToPublish = null;

    configBot.masks.abVersion = null;
}