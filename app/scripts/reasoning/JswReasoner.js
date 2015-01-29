/**
 * Created by Spadon on 14/10/2014.
 */

var CONFIG = {};

/**
 * Main task
 */
function startReasoner(data) {

    /**
     * Creating a reasoner object for the given ontology
     */
    //try {
        var reasoner, stringifiedReasoner,
            seen = [];
        // If the reasoner has been already initialized
        if(data.reasoner) {
            reasoner = data.reasoner;
        // If the classification is done client side
        } else {
            reasoner = new BrandT(data);
        }

        stringifiedReasoner = JSON.stringify(reasoner, function(key, val) {
            if (val != null && typeof val == "object") {
                if (seen.indexOf(val) >= 0)
                    return;
                seen.push(val)
            }
            return val
        });

        CONFIG.rdf = data.rdf;
        send({msg: "Reasoner ready. " + reasoner.aBox.database.ClassAssertion.length + " class assertions, " + reasoner.aBox.database.ObjectPropertyAssertion.length + " object property assertions.", toggleLoads:true});
        send({reasoner: stringifiedReasoner});
    /*} catch(err) {
        send({ msg: "Reasoner unavailable. " + err.toString(), isError:true, toggleLoads: true });
    }*/
}

function queryReasoner(queryString, reasoner) {
    /**
     * Creating SPARQL query
     */

    try {
        var query = sparql.parse(queryString);
    } catch(err) {
        send({ msg: "SPARQL parsing failed. " + err.toString(), isError:true, toggleLoads: true });
    }


    /**
     * Querying the reasoner
     */

    try {
        reasoner.aBox.__proto__ = TrimQueryABox.prototype;

        var results = reasoner.aBox.answerQuery(query);
        send({
            msg: "Query : " + query.triples.length + " triple(s), " + query.variables.length + " variable(s). Results : " + results.length,
            toggleLoads: true
        });
        if(results.length) send({sparqlResults: results});
    } catch(err) {
        send({ msg: 'Error while evaluating. ' + err.toString(), isError: true, toggleLoads: true })
    }

}