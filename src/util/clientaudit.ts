import {UserProfile} from '@loopback/security';

export class ClientAuditUtil {
  static async formatAndCreateAudit(
    changes: string[],
    currentUserProfile: UserProfile,
    clientId: any,
    clientAuditRepository: any,
  ) {
    const entries = [];

    for (var index = 0; index < changes.length; index++) {
      const change = changes[index];

      const auditEntry = {
        data: change,
        added: new Date().toUTCString(),
        clientId: clientId,
        updatedBy: currentUserProfile ? currentUserProfile.id : 'admin',
      };

      entries.push(auditEntry);

      await clientAuditRepository.create(auditEntry);
    }

    return entries;
  }

  static getPropertyChangeText(
    childClassReadableName: string,
    jsonProps: string[],
    oldEntity: any,
    newEntity: any,
  ) {
    const changes = [];

    for (var prop in newEntity) {
      if (prop != 'id') {
        const oldValue = oldEntity[prop] ? oldEntity[prop] : '';
        const newValue = newEntity[prop] ? newEntity[prop] : '';

        if (jsonProps.indexOf(prop) != -1) {
          if (!oldValue) {
            if (oldValue !== newValue) {
              changes.push(
                childClassReadableName +
                  ' Property ' +
                  prop +
                  ' changed from unset',
              );
            }
          } else if (!newValue) {
            if (oldValue !== newValue) {
              changes.push(
                childClassReadableName +
                  ' Property ' +
                  prop +
                  ' changed to unset',
              );
            }
          } else {
            try {
              const oldJson = JSON.parse(oldValue);
              const newJson = JSON.parse(newValue);

              // old and changed props
              for (var internalProp in oldJson) {
                if (newJson[internalProp] !== undefined) {
                  if (
                    Array.isArray(oldJson[internalProp]) ||
                    Array.isArray(newJson[internalProp])
                  ) {
                    if (
                      Array.isArray(oldJson[internalProp]) &&
                      Array.isArray(newJson[internalProp])
                    ) {
                      const arr1 = oldJson[internalProp].map(
                        ClientAuditUtil.arrayEntryToString,
                      );
                      const arr2 = newJson[internalProp].map(
                        ClientAuditUtil.arrayEntryToString,
                      );

                      // deleted items
                      for (const oldItem of arr1) {
                        if (arr2.indexOf(oldItem) == -1) {
                          changes.push(
                            childClassReadableName +
                              ' Property ' +
                              prop +
                              ' (' +
                              internalProp +
                              ') Deleted Entry: ' +
                              oldItem,
                          );
                        }
                      }

                      // added items
                      for (const newItem of arr2) {
                        if (arr1.indexOf(newItem) == -1) {
                          changes.push(
                            childClassReadableName +
                              ' Property ' +
                              prop +
                              ' (' +
                              internalProp +
                              ') Added Entry: ' +
                              newItem,
                          );
                        }
                      }
                    } else {
                      changes.push(
                        childClassReadableName +
                          ' Property ' +
                          prop +
                          ' (' +
                          internalProp +
                          ') Type Changed',
                      );
                    }
                  } else if (
                    ClientAuditUtil.arrayEntryToString(oldJson[internalProp]) !=
                    ClientAuditUtil.arrayEntryToString(newJson[internalProp])
                  ) {
                    changes.push(
                      childClassReadableName +
                        ' Property ' +
                        prop +
                        ' (' +
                        internalProp +
                        ') Changed from ' +
                        ClientAuditUtil.arrayEntryToString(
                          oldJson[internalProp],
                        ) +
                        ' to ' +
                        ClientAuditUtil.arrayEntryToString(
                          newJson[internalProp],
                        ),
                    );
                  }
                } else if (newJson[internalProp] === undefined) {
                  changes.push(
                    childClassReadableName +
                      ' Property ' +
                      prop +
                      ' (' +
                      internalProp +
                      ') Deleted',
                  );
                }
              }

              // new props
              for (var internalProp in newJson) {
                if (oldJson[internalProp] === undefined) {
                  changes.push(
                    childClassReadableName +
                      ' Property ' +
                      prop +
                      ' (' +
                      internalProp +
                      ') Added - ' +
                      newJson[internalProp].toString(),
                  );
                }
              }
            } catch (e) {
              changes.push(e.toString());
            }
          }
        } else if (
          typeof oldValue == 'string' &&
          typeof newValue == 'string' &&
          oldValue !== newValue
        ) {
          const trimOldValue =
            oldValue.toString().length > 100
              ? oldValue.toString().substring(0, 97) + '...'
              : oldValue.toString();
          const trimNewValue =
            newValue.toString().length > 100
              ? newValue.toString().substring(0, 97) + '...'
              : newValue.toString();

          changes.push(
            childClassReadableName +
              ' Property ' +
              prop +
              ' changed from "' +
              trimOldValue +
              '" to "' +
              trimNewValue +
              '"',
          );
        }
      }
    }

    return changes;
  }

  static arrayEntryToString(entry: any) {
    if (typeof entry == 'string') {
      return entry;
    } else if (
      entry &&
      entry.str !== undefined &&
      entry.startDate !== undefined
    ) {
      return (
        entry.str +
        (entry.startDate ? ' (' + entry.startDate.toString() + ')' : '')
      );
    } else {
      return JSON.stringify(entry);
    }
  }
}
