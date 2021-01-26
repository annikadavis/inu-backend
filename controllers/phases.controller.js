const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();



exports.createPhase = async (req, res, next) => {
	try {
		const name = req.body.name;
		const createdPhase = await client.phases.create({
			data: { name },
		});
		res.status(200).json(createdPhase);
	} catch (err) {
		next(err);
	}
};


exports.getAllPhase = async (req,res,next) => {
    try {
		const allPhases = await client.phases.findMany();
		res.status(200).json(allPhases);
	} catch (err) {
		next(err);

    }
};

exports.getOnePhase = async (req, res, next) => {
	try {
		const phaseId = Number(req.params.phaseId);
		const onePhase = await client.phases.findUnique({
			where: {id: phaseId}
		});
		res.status(200).json(onePhase);
	} catch (err) {
		next(err);
	}
};

exports.updatePhase = async (req, res, next) => {
	try {
		const phaseId = Number(req.params.phaseId);
		const updatedName = req.body.name;
		const updatedPhase = await client.phases.update({
			where: { id: phaseId },
			data: { name: updatedName }
		});
		res.status(200).json(updatedPhase);
	} catch (err) {
		next(err);
	}
};

exports.deletePhase = async (req, res, next) => {
	try {
		const phaseId = Number(req.params.phaseId);
		const deletedPhase = await client.phases.delete({
			where: { id: phaseId }
		});
		res.status(200).json(deletedPhase);
	} catch (err) {
		next(err);
	}
};

// router.post("/:phaseId/suggestions/", createSuggestion );
// router.get("/:phaseId/suggestions/", getAllSuggestions );
// router.get("/:phaseId/suggestions/:suggestionId", getOneSuggestion);
// router.get("/:phaseId/suggestions/random", getRandomSuggestion);
// router.put("/:phaseId/suggestions/:suggestionId", updateSuggestion);
// router.delete("/:phaseId/suggestions/:suggestionId", deleteSuggestion);

exports.createSuggestion = async (req, res, next) => {
	try {
		const phaseIdAddTo = Number(req.params.phaseId);
		const { text } = req.body; 
		const addedSuggestion = await client.suggestions.create({
			// const newTrack = await client.track.create({
			// 	data: {
			// 	  title: title,
			// 	  url: url,
			// 	  Album: { connect: { id: albumId } },
			// 	},
			//   });
			data:{ 
				text: text,
				phase: { connect: { id: phaseIdAddTo } }

			}
		})
		res.status(200).json(addedSuggestion)

	} catch (err) {
		next(err);
	}
};

exports.getAllSuggestions = async (req, res, next) => {
	try {
		const phaseId = Number(req.params.phaseId);
		const allSuggestions = await client.suggestions.findMany({
			where: {phaseId: phaseId}
		})
		res.status(200).json(allSuggestions)

	} catch (err) {
		next(err);
	}
}

exports.getOneSuggestion = async (req, res, next) => {
	try {
		const phaseId = Number(req.params.phaseId);
		const suggestionId = Number(req.params.suggestionId);
		const allSuggestions = await client.suggestions.findUnique({
			where: {suggestionId: suggestionId}
		})
		res.status(200).json(allSuggestions)

	} catch (err) {
		next(err);
	}	
}

exports.getRandomSuggestion = async (req, res, next) => {
	
}

exports.updateSuggestion = async (req, res, next) => {
	
}

exports.deleteSuggestion = async (req, res, next) => {
	
}