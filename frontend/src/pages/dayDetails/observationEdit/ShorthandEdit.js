import React, { memo, useCallback, useState } from "react";
import {
  Box, Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import EditShorthand from "../../editShorthand";

const ShorthandEdit = ({ day, dayId, onEditShorthandClose }) => {
  const { t } = useTranslation();

  const [editShorthandModalOpen, setEditShorthandModalOpen] = useState(false);

  const handleEditShorthandOpen = useCallback(() => {
    setEditShorthandModalOpen(true);
  }, []);

  const handleEditShorthandClose = useCallback(() => {
    setEditShorthandModalOpen(false);
    onEditShorthandClose();
  }, []);

  return (
    <>
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleEditShorthandOpen}>
          {t("editObservations")}
        </Button>{" "}
      </Box>
      <EditShorthand
        day={day}
        dayId={dayId}
        open={editShorthandModalOpen}
        handleCloseModal={handleEditShorthandClose}
      />
    </>
  );
};

ShorthandEdit.propTypes = {
  day: PropTypes.string.isRequired,
  dayId: PropTypes.number.isRequired,
  onEditShorthandClose: PropTypes.func.isRequired
};

export default memo(ShorthandEdit);
