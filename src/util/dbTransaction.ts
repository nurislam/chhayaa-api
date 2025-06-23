import {MysqlDbDataSource} from '../datasources';

export const useTransaction = async (
  dataSource: MysqlDbDataSource,
  callback: Function,
) => {
  const transaction = await dataSource.beginTransaction({
    timeout: 30000,
  });

  try {
    const result = await callback(transaction);
    await transaction.commit();
    console.log('===> Transaction commited');
    return result;
  } catch (err) {
    await transaction.rollback();
    console.log('===> Transaction rolledback');
    throw err;
  }
};
