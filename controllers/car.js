const { unlink } = require("fs");
const { Car, History, sequelize } = require("../models");
const { json } = require("sequelize");

class CarController {
  static async createCar(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, price, description, location, engine } = req.body;
      const userId = req.user.id;

      const uploadFiles = req.files;

      const photoData = uploadFiles.map((file) => {
        return file.filename;
      });
      const newCar = await Car.create(
        {
          title,
          price: Number(price),
          description,
          photo: JSON.stringify(photoData),
          location,
          engine,
          userId,
        },
        { transaction: t }
      );

      await History.create(
        {
          name: newCar.title,
          updatedBy: req.user.name,
          description: `${newCar.title} has been created`,
        },
        { transaction: t }
      );

      await t.commit();

      res.status(201).json({
        status: true,
        message: "Succesfully create new car",
        statusCode: "OK",
        response: newCar,
      });
    } catch (error) {
      t.rollback();
      next(error);
    }
  }

  static async getCarList(req, res, next) {
    try {
      const result = await Car.findAll({ raw: true, where: { status: true, sold: false } });

      const transformResult = result.map((data, index) => {
        const { ...body } = data;
        const photoData = JSON.parse(data.photo);
        return {
          no: index + 1,
          url_photo: photoData.map((d, k) => {
            return `${req.headers.host}/public/${d}`;
          }),
          ...body,
        };
      });

      res.status(200).json({
        status: true,
        message: "Succesfully get all cars",
        statusCode: "OK",
        response: transformResult,
      });
    } catch (error) {
      next(error);
    }
  }

  static async carDetail(req, res, next) {
    try {
      const { id } = req.params;

      const result = await Car.findByPk(id);
      if (!result) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: `Car with id ${id} not found`,
            },
          ],
        };
      }
      const photoData = JSON.parse(result.photo);
      const transformResult = {
        result,
        url_photo: photoData.map((d, k) => {
          return `${req.headers.host}/public/${d}`;
        }),
      };

      res.status(200).json({
        status: true,
        message: `Succesfully get car with id ${id}`,
        statusCode: "OK",
        response: transformResult,
      });
    } catch (error) {
      next(error);
    }
  }

  static async editCar(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { title, price, description, location, engine } = req.body;
      const updatedBy = req.user.name;
      const { id } = req.params;
      const uploadFiles = req.files;

      let result;

      const verifyData = await Car.findByPk(id);
      if (!verifyData) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: `Car with id ${id} not found`,
            },
          ],
        };
      }
      const oldData = JSON.parse(verifyData.photo);
      if (uploadFiles.length > 0) {
        for (const data of oldData) {
          unlink(`${uploadFiles[0].destination}/${data}`, (err) => {
            if (err) {
              throw {
                name: "BadRequest",
                errors: [
                  {
                    message: "Failed to update photo",
                  },
                ],
              };
            }
          });
        }
        const photoData = uploadFiles.map((file) => {
          return file.filename;
        });
        result = await Car.update(
          {
            title,
            price: Number(price),
            description,
            photo: JSON.stringify(photoData),
            location,
            engine,
          },
          { where: { id }, transaction: t }
        );
      } else {
        result = await Car.update(
          {
            where: { id },
            title,
            price: Number(price),
            description,
            location,
            engine,
          },
          { where: { id }, transaction: t }
        );
      }

      await History.create(
        {
          name: verifyData.title,
          updatedBy,
          description: `${verifyData.title} with id ${id} has been updated`,
        },
        { transaction: t }
      );
      await t.commit();

      res.status(201).json({
        status: true,
        message: `Succesfully update car with id ${id}`,
        statusCode: "OK",
      });
    } catch (error) {
      t.rollback();
      console.log(error);
      next(error);
    }
  }

  static async changeStatusCar(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const verifyCar = await Car.findByPk(id);
      if (!verifyCar) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: `Car with id ${id} not found`,
            },
          ],
        };
      }

      if (verifyCar.status) {
        await Car.update({ status: false }, { where: { id }, transaction: t });
      } else {
        await Car.update({ status: true }, { where: { id }, transaction: t });
      }

      await History.create(
        {
          name: verifyCar.title,
          updatedBy: req.user.name,
          description: `${verifyCar.title} has been deleted`,
        },
        { transaction: t }
      );

      t.commit();
      res.status(201).json({
        status: true,
        message: `Succesfully update car's status with id ${id}`,
        statusCode: "OK",
        response: `${verifyCar.title} has been deleted`
      });
    } catch (error) {
      console.log(error, "<<<<");
      t.rollback();
      next(error);
    }
  }

  static async changeSoldCar(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { id } = req.params;

      const verifyCar = await Car.findByPk(id);
      if (!verifyCar) {
        throw {
          name: "NotFound",
          errors: [
            {
              message: `Car with id ${id} not found`,
            },
          ],
        };
      }

      if (verifyCar.sold) {
        await Car.update({ sold: false }, { where: { id }, transaction: t });
        await History.create(
          {
            name: verifyCar.title,
            updatedBy: req.user.name,
            description: `${verifyCar.title} back on list`,
          },
          { transaction: t }
        );
      } else {
        await Car.update({ sold: true }, { where: { id }, transaction: t });
        await History.create(
          {
            name: verifyCar.title,
            updatedBy: req.user.name,
            description: `${verifyCar.title} already sold`,
          },
          { transaction: t }
        );
      }
      t.commit();

      res.status(201).json({
        status: true,
        message: `Succesfully update car's sold status with id ${id}`,
        statusCode: "OK",
      });
    } catch (error) {
      t.rollback();
      next(error);
    }
  }

  static async getSoldCar(req, res, next) {
    try {
      console.log('masuk controller');
      const result = await Car.findAll({ raw: true, where: { status: true, sold: true } });

      const transformResult = result.map((data, index) => {
        const { ...body } = data;
        const photoData = JSON.parse(data.photo);
        return {
          no: index + 1,
          url_photo: photoData.map((d, k) => {
            return `${req.headers.host}/public/${d}`;
          }),
          ...body,
        };
      });

      res.status(200).json({
        status: true,
        message: "Succesfully get all sold cars",
        statusCode: "OK",
        response: transformResult,
      });
    } catch (error) {
      next(error);
    }
  }
}



module.exports = CarController;
