export const search = async (req, res) => {
  try {
    console.log(JSON.stringify(req, null, 2));
    // const { q } = req.query;
    // console.log('query: ', q);

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {}
};
