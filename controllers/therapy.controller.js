const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

// router.post("/", createTherapy );
// router.put("/:therapyId", updateTherapy);
// router.get("/", getAllTherapies);
// router.delete("/:therapyId", deleteTherapy);

// id        Int      @id @default(autoincrement())
//   order     Int      @unique
//   title     String
//   sub_title String
//   icon      String
//   audio     String

exports.createTherapy = async (req, res, next) => {
	try {
		const {order, title, sub_title, audio } = req.body;
		const newTherapy = await client.therapy.create({
			data: { order, title, sub_title, audio},
		});
		res.status(200).json(newTherapy);
	} catch (err) {
		next(err);
	}
};

exports.updateTherapy = async (req, res, next) => {
	try {
		const therapyId = Number(req.params.therapyId);
		const {order, title, sub_title, audio } = req.body;
		const updatedTherapy = await client.therapy.update({
			where: { id: therapyId },
			data: {order, title, sub_title, audio }
		});
		res.status(200).json(updatedTherapy);
	} catch (err) {
		next(err);
	}

}

exports.getAllTherapies = async (req, res, next) => {
	try {
		const allTherapy = await client.therapy.findMany();
		res.status(200).json(allTherapy);
	} catch (err) {
		next(err);
	}

}

exports.deleteTherapy = async (req, res, next) => {
	try {
		const therapyId = Number(req.params.therapyId);
		const deletedTherapy = await client.therapy.delete({
			where: { id: therapyId },
		});
		res.status(200).json(deletedTherapy);
	} catch (err) {
		next(err);
	}
	

}
