import Dexie from "dexie";

const DraftDB = new Dexie("drafts");
DraftDB.version(1).stores({
  drafts: "++id,userID,observatory,timestamp",
});

const addDraft = async (data) => {
  return DraftDB.drafts.put({ ...data, timestamp: Date.now() })
    .then(res => {
      return res;
    }).catch(err => {
      console.error(err);
    });
};

const clean = async () => {
  DraftDB.drafts
    .where("timestamp")
    .below(Date.now() - 1000 * 60 * 60 * 24 * 31)
    .delete();
};

const clearAll = async (id) => DraftDB.drafts.where("userID").equals(id).delete();

const deleteDraft = async (id) => {
  return DraftDB.drafts.delete(id);
};

export { DraftDB, addDraft, deleteDraft, clean, clearAll };
