import BuildDetails from '../models/buildDetailsModel.js'
import Build from '../models/buildsModel.js'

async function createBuild(req, res, next) {
  try {
    const build = Build(req.body)
    const newBuild = await build.save()

    // Builds should start at lvl 1, with no buffs yet
    const buildDetails = await BuildDetails.create({
      buildId: newBuild._id,
      levels: [{ level: 1 }],
    })

    if (!buildDetails) {
      throw new Error('Build details failed to create')
    }

    // Update the build with reference to the details
    newBuild.buildDetails = buildDetails._id
    newBuild.save()

    res.status(201) // Created
    res.json(newBuild)
  } catch (error) {
    next(error)
  }
}

async function getBuilds(req, res, next) {
  try {
    const builds = await Build.find({})
    res.json(builds)
  } catch (error) {
    next(error)
  }
}

async function getBuildById(req, res, next) {
  try {
    const buildId = req.params.id
    const build = await Build.findById(buildId).populate('buildDetails')

    if (build) {
      res.json(build)
    } else {
      res.status(404)
      throw new Error('Build could not be found')
    }
  } catch (error) {
    next(error)
  }
}

async function updateBuildById(req, res, next) {
  try {
    const buildId = req.params.id
    const build = await Build.findById(buildId)

    if (!build) {
      res.status(404)
      throw new Error('Build Not Found')
    }

    const { name, summary } = req.body

    build.name = name
    build.summary = summary
    const updatedBuild = await build.save()

    res.json(updatedBuild)
  } catch (error) {
    next(error)
  }
}

async function addNewLevel(req, res, next) {
  try {
    const buildId = req.params.id
    const buildDetails = await BuildDetails.findOne({ buildId })

    if (!buildDetails) {
      res.status(404)
      throw new Error('Build Not Found')
    }

    const { improvements } = req.body

    console.log({ buildDetails, improvements })

    let maxLevel = 0
    buildDetails.levels.forEach((levelElement) => {
      maxLevel = Math.max(levelElement.level, maxLevel)
    })

    const newLevel = {
      improvements,
      level: maxLevel + 1,
    }

    buildDetails.levels.push(newLevel)
    const updatedBuild = await buildDetails.save()

    res.json(updatedBuild)
  } catch (error) {
    next(error)
  }
}

async function updateLevel(req, res, next) {
  try {
    const buildId = req.params.id
    const levelNumber = Number(req.params.level)
    const buildDetails = await BuildDetails.findOne({ buildId })

    if (!buildDetails) {
      res.status(404)
      throw new Error('Build Not Found')
    }

    const { improvements } = req.body
    const level = buildDetails.levels.find(
      (levelElement) => levelElement.level === levelNumber
    )

    if (!level) {
      res.status(404)
      throw new Error(
        'Level not found for build, did you mean to create a new one?'
      )
    }

    // Place the new improvements into the existing object
    // This is a complete replacement
    level.improvements = improvements
    const updatedBuild = await buildDetails.save()

    res.json(updatedBuild)
  } catch (error) {
    next(error)
  }
}

async function getLevel(req, res, next) {
  try {
    const buildId = req.params.id
    const levelNumber = Number(req.params.level)
    const buildDetails = await BuildDetails.findOne({ buildId })

    if (!buildDetails) {
      res.status(404)
      throw new Error('Build Not Found')
    }

    const level = buildDetails.levels.find(
      (levelElement) => levelElement.level === levelNumber
    )

    if (!level) {
      res.status(404)
      throw new Error(
        'Level not found for build, did you mean to create a new one?'
      )
    }

    res.json(level)
  } catch (error) {
    next(error)
  }
}

export {
  createBuild,
  getBuilds,
  getBuildById,
  updateBuildById,
  addNewLevel,
  updateLevel,
  getLevel,
}
