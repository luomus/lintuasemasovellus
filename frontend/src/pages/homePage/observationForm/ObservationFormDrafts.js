import React, {
  useState
} from "react";
import {
  Modal, Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, Button,
  Table, TableRow, TableBody, TableHead, TableCell,
  IconButton, Tooltip
} from "@mui/material";
import { Bookmarks } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useLiveQuery } from "dexie-react-hooks";
import { DraftDB, deleteDraft, clearAll } from "../../../services/draftService";
import { StyledTableCell } from "../../../globalComponents/common";

export const ObservationFormDrafts = ({ user, userObservatory, draftID, onDraftSelect }) => {
  const { t } = useTranslation();

  const drafts = useLiveQuery(async () => {
    return await DraftDB.drafts
      .where("userID")
      .equals(user.id)
      .filter(e => e.observatory === userObservatory)
      .reverse()
      .toArray();
  });

  const [draftsOpen, setDraftsOpen] = useState(false);

  const handleDraftConfirm = (e) => {
    let el = drafts.find(d => d.id === e);
    onDraftSelect(el);
  };

  return (
    <>
      <Tooltip title={t("drafts")}>
        <IconButton id="open-draft-button" size="medium" onClick={() => setDraftsOpen(true)} variant="contained" color="primary">
          <Bookmarks fontSize="default" />
        </IconButton>
      </Tooltip>
      <Modal
        open={draftsOpen}
        onClose={() => setDraftsOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Dialog
          open={draftsOpen}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{t("drafts")}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" style={{ whiteSpace: "pre-line" }}>
              {t("draftInfoText")} <br />
              {t("overwrite")}
            </DialogContentText>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>{t("date")}</StyledTableCell>
                  <StyledTableCell>{t("migrantObservations")}</StyledTableCell>
                  <StyledTableCell>{t("edit")}</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  drafts?.map(e =>
                    <TableRow key={e.id} hover>
                      <TableCell>
                        { e.id === draftID && ">"} {e.day} { e.type } { e.location}
                      </TableCell>
                      <TableCell>
                        {e.shorthand}
                      </TableCell>
                      <TableCell>
                        <Button id="confirm-draft-button" onClick={() => handleDraftConfirm(e.id)} color="primary" variant="contained">
                          {t("edit")}
                        </Button>
                        <Button id="delete-draft-button" onClick={() => deleteDraft(e.id)} variant="contained">
                          {t("remove")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button id="delete-all-button" onClick={() => confirm(`${t("remove")} ${t("all")} ?!?`.toUpperCase()) && clearAll(user.id)} color="secondary" variant="contained" autoFocus>
              {t("remove")} {t("all")}
            </Button>
            <Button id="cancel-copy-button" onClick={() => setDraftsOpen(false)} color="secondary" variant="contained" autoFocus>
              {t("cancel")}
            </Button>
          </DialogActions>
        </Dialog>
      </Modal>
    </>
  );
};

ObservationFormDrafts.propTypes = {
  user: PropTypes.object.isRequired,
  userObservatory: PropTypes.string.isRequired,
  draftID: PropTypes.number.isRequired,
  onDraftSelect: PropTypes.func.isRequired
};
