const { Datastore } = require("@google-cloud/datastore");

/**
 * This function will grab all the current leaderboard entries in the database.
 * @param {*} datastore 
 */
async function fetchLeaderboardEntries(datastore) {
    console.log("here")
    const entryQuery = datastore
        .createQuery("leaderboard-entry")
        .sort;
    
        let [entries] = await datastore.runQuery(entryQuery);
        console.log(entries)
        
        for (const entry of entries) {
            [entry.url] = await datastore.keyToLegacyUrlSafe(entry[Datastore.KEY]);
        }

        return entries;
}

exports.fetchLeaderboardEntries = fetchLeaderboardEntries