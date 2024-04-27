const asyncHandler = require('express-async-handler');
const Vaction = require('../models/vacationModel');



exports.getVacations = asyncHandler(async (req, res) => {
  let x;
  let y=req.query.status
  if(y=="null")
  {
      x=null
  }
  else

  if(y=="true")
  {
    x=true
  }
  else
  if(y=="false")
  {
    x=false
  }
  console.log("aaaaaaaaaaaaaa",req.query,x)

    const vacations = await Vaction.find(
      {status:x}
    ).populate("employee")
    res.json(vacations);
  });
exports.getVacationsFil = asyncHandler(async (req, res) => {
  try {
    const employeeId = req.query.employee; // Récupérer l'ID de l'employé depuis la requête
    let status = req.query.status; // Récupérer le statut depuis la requête

    // Convertir la chaîne de statut en boolean si elle est présente
    if (status === "null") {
      status = null;
    } else if (status === "true") {
      status = true;
    } else if (status === "false") {
      status = false;
    }

    // Vérifier si l'ID de l'employé est fourni
    if (!employeeId) {
      throw new Error("ID de l'employé non spécifié dans la requête.");
    }

    // Filtrer les congés en fonction de l'ID de l'employé et du statut s'il est fourni
    const filter = { employee: employeeId };
    if (status !== undefined) {
      filter.status = status;
    }

    // Rechercher les congés correspondants dans la base de données
    const vacations = await Vaction.find(filter).populate("employee");
    res.json(vacations);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la récupération des congés', error: error.message });
  }
});

  
  exports.getVacation = asyncHandler(async (req, res) => {
    const vacation = await Vaction.findById(req.params.id).populate("employee")
    
    if (vacation) {
      res.json(vacation);
    } else {
      res.status(404);
      throw new Error('Vacation not found');
    }
  });
  
  exports.createVacation = async (req, res) => {
    try {
      const { periode, enddate, strtdate, typevaction, status,employee } = req.body;
      const vacation = await Vaction.create({ periode, enddate, strtdate, typevaction, status,employee });
      res.status(201).json(vacation);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create vacation', error: error.message });
    }
  };
  
  exports.updateVacation = asyncHandler(async (req, res) => {
    const { periode, enddate, strtdate, typevaction, status } = req.body;
    const vacation = await Vaction.findById(req.params.id);
    if (vacation) {
      vacation.periode = periode;
      vacation.enddate = enddate;
      vacation.strtdate = strtdate;
      vacation.typevaction = typevaction;
      vacation.status = status;
  
      const updatedVacation = await vacation.save();
      res.json(updatedVacation);
    } else {
      res.status(404);
      throw new Error('Vacation not found');
    }
  });
//   exports.elbou = asyncHandler(async (req, res) => {
//     let x;

// if(req.body.status=='true')
// {
//   x=true
// }
// else
// x=false

// const vocation = await Vaction.findByIdAndUpdate(req.params.id, {status:x}, {
//       new: true,
//     });
//      if (vocation) {

//       res.json(vocation);
//     } else {
//       res.status(404);
//       throw new Error('Vacation not found');
//     }
//     // const { periode, enddate, strtdate, typevaction, status } = req.body;
//     // const vacation = await Vaction.findById(req.params.id);
//     // if (vacation) {
//     //   vacation.periode = periode;
//     //   vacation.enddate = enddate;
//     //   vacation.strtdate = strtdate;
//     //   vacation.typevaction = typevaction;
//     //   vacation.status = status;
  
//     //   const updatedVacation = await vacation.save();
//     //   res.json(updatedVacation);
//     // } else {
//     //   res.status(404);
//     //   throw new Error('Vacation not found');
//     // }
//   });
  exports.deleteVacation = asyncHandler(async (req, res) => {
    const vacation = await Vaction.findById(req.params.id);
    if (vacation) {
      await vacation.remove();
      res.json({ message: 'Vacation removed' });
    } else {
      res.status(404);
      throw new Error('Vacation not found');
    }
  });
  