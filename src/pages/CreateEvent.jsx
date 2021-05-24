import React from "react";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useParams, useHistory } from "react-router-dom";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import TimePicker from "@material-ui/lab/TimePicker";
import DatePicker from "@material-ui/lab/DatePicker";

import { addEvent, editEvent } from "../state/actions/events";

const useStyles = makeStyles((theme) => ({
    button: {
        marginTop: theme.spacing(2),
    },
    dialogText: {
        padding: theme.spacing(2),
    },
}));

const typesEventItems = [
    { name: "Пометки/Другое", value: "notes" },
    { name: "Праздничные дни", value: "holidays" },
    { name: "Мероприятия", value: "events" },
];

const addEventToLocalStorage = (item) => {
    const events = JSON.parse(localStorage.getItem("events"));
    if (!Array.isArray(events)) {
        localStorage.setItem("events", JSON.stringify([item]));
        return;
    }
    localStorage.setItem("events", JSON.stringify([...events, item]));
};

const editEventInLocalStorage = (data) => {
    const events = JSON.parse(localStorage.getItem("events"));
    const event = events.find((event) => event.id === data.id);
    Object.assign(event, data);
    localStorage.setItem("events", JSON.stringify(events));
};

export default function CreateEvent({ dispatch, events }) {
    const history = useHistory();
    const classes = useStyles();

    const [openDialog, setOpenDialog] = React.useState(false);

    const { id } = useParams();
    let possibleEvent;
    if (id) {
        possibleEvent = events.find((event) => event.id === id);
    }

    if (id && !possibleEvent) {
        history.push("/404");
    }

    const initialTypeEvent = typesEventItems[0].value;

    const { handleSubmit, control, watch, setValue } = useForm({
        defaultValues: {
            name: possibleEvent ? possibleEvent.name : "",
            typeEvent: possibleEvent
                ? possibleEvent.typeEvent
                : initialTypeEvent,
            date: possibleEvent ? possibleEvent.date : new Date(),
            text: possibleEvent && possibleEvent.text ? possibleEvent.text : "",
            money:
                possibleEvent && possibleEvent.money ? possibleEvent.money : "",
            time:
                possibleEvent && possibleEvent.time
                    ? new Date(
                          2020,
                          0,
                          1,
                          Number(possibleEvent.time.split(":")[0]),
                          Number(possibleEvent.time.split(":")[1])
                      )
                    : new Date(),
            adress:
                possibleEvent && possibleEvent.adress
                    ? possibleEvent.adress
                    : "",
        },
    });

    const onSubmit = (data) => {
        const id = possibleEvent ? possibleEvent.id : uuidv4();
        const time = String(data.time).match(/[0-9][0-9][:][0-5][0-9]/)[0];

        const dataCopy = JSON.parse(JSON.stringify(data));

        if (typeEvent === "notes") {
            delete dataCopy.time;
            delete dataCopy.adress;
            delete dataCopy.money;
        }
        if (typeEvent === "holidays") {
            delete dataCopy.time;
            delete dataCopy.adress;
            delete dataCopy.text;
        }
        if (typeEvent === "events") {
            delete dataCopy.money;
            delete dataCopy.text;
            dataCopy.time = time;
        }

        dataCopy.id = id;
        dataCopy.date = dataCopy.date.split("T")[0];

        if (possibleEvent) {
            editEventInLocalStorage(dataCopy);
            dispatch(editEvent(dataCopy));
            setOpenDialog(true);
            return;
        }
        addEventToLocalStorage(dataCopy);
        dispatch(addEvent(dataCopy));
        setOpenDialog(true);
        resetForm();
    };

    const typeEvent = watch("typeEvent") || initialTypeEvent;

    const resetForm = () => {
        resetAdditionalFields();
        setValue("date", new Date());
        setValue("name", "");
    };

    const resetAdditionalFields = () => {
        setValue("text", "");
        setValue("money", "");
        setValue("adress", "");
        setValue("time", new Date());
    };

    React.useEffect(() => {
        if (!possibleEvent) {
            resetAdditionalFields();
        }
    }, [typeEvent]);

    return (
        <Container maxWidth="xs">
            <Typography component="h1" align="center" variant="h5">
                Создание события
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: true }}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <TextField
                            error={!Boolean(value) || value.length < 4}
                            helperText={
                                (!Boolean(value) && "Заполните поле") ||
                                (value.length < 4 &&
                                    "Слишком короткое название")
                            }
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            autoFocus
                            label="Введите название события"
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="typeEvent"
                    render={({ field: { onChange, value } }) => (
                        <FormControl
                            margin="normal"
                            variant="outlined"
                            fullWidth
                        >
                            <InputLabel id="typeEventLabel">
                                Выберите тип события
                            </InputLabel>
                            <Select
                                labelId="typeEventLabel"
                                id="typeEvent"
                                label="Выберите тип события"
                                value={value}
                                onChange={onChange}
                                disabled={Boolean(possibleEvent)}
                            >
                                {typesEventItems.map((item, index) => (
                                    <MenuItem key={index} value={item.value}>
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                />

                <Controller
                    control={control}
                    name="date"
                    rules={{
                        required: true,
                        validate: (value) => {
                            return /[2][0][0-9][0-9]/.test(value);
                        },
                    }}
                    render={({
                        field: { onChange, value },
                        fieldState: { error },
                    }) => (
                        <DatePicker
                            label="Выберите дату"
                            minDate={new Date("2000-01-01")}
                            maxDate={new Date("2099-12-31")}
                            mask="__.__.____"
                            onChange={onChange}
                            value={value}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    margin="normal"
                                    error={Boolean(error) || !Boolean(value)}
                                    required
                                    helperText={
                                        (!Boolean(value) && "Заполните поле") ||
                                        (error?.type === "validate" &&
                                            "Введите корректную дату")
                                    }
                                />
                            )}
                        />
                    )}
                />

                {typeEvent === "notes" && (
                    <Controller
                        control={control}
                        name="text"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={!Boolean(value) || value.length < 4}
                                helperText={
                                    (!Boolean(value) && "Поле на заполнено") ||
                                    (value.length < 4 && "Слишком коротко")
                                }
                                id="text"
                                label="Введите текст"
                                margin="normal"
                                rows={4}
                                fullWidth
                                multiline
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                )}
                {typeEvent === "holidays" && (
                    <Controller
                        control={control}
                        name="money"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                error={!Boolean(value)}
                                helperText={
                                    !Boolean(value) && "Поле не заполнено"
                                }
                                id="money"
                                label="Бюджет"
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            РУБ
                                        </InputAdornment>
                                    ),
                                }}
                                value={value}
                                onChange={(e) => {
                                    if (e.target.value.match(/^[0-9]*$/)) {
                                        onChange(e.target.value);
                                    }
                                }}
                            />
                        )}
                    />
                )}
                {typeEvent === "events" && (
                    <>
                        <Controller
                            control={control}
                            name="time"
                            rules={{
                                required: true,
                                validate: (value) => {
                                    return /[0-9][0-9][:][0-5][0-9][:][0-5][0-9]/.test(
                                        value
                                    );
                                },
                            }}
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TimePicker
                                    error={true}
                                    label="Выберите время"
                                    value={value}
                                    onChange={onChange}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            margin="normal"
                                            required
                                            fullWidth
                                            error={
                                                Boolean(error) ||
                                                !Boolean(value)
                                            }
                                            helperText={
                                                (!Boolean(value) &&
                                                    "Заполните поле") ||
                                                (error?.type === "validate" &&
                                                    "Введите корректное время")
                                            }
                                        />
                                    )}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="adress"
                            render={({ field: { onChange, value } }) => (
                                <TextField
                                    error={!Boolean(value) || value.length < 4}
                                    helperText={
                                        (!Boolean(value) &&
                                            "Поле на заполнено") ||
                                        (value.length < 4 &&
                                            "Слишком короткий адрес")
                                    }
                                    value={value}
                                    onChange={onChange}
                                    id="adress"
                                    label="Адрес"
                                    margin="normal"
                                    fullWidth
                                />
                            )}
                        />
                    </>
                )}
                <div className={classes.button}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                    >
                        Сохранить
                    </Button>
                </div>
            </form>
            <Dialog
                aria-labelledby="success"
                open={openDialog}
                onClose={() => setOpenDialog(false)}
            >
                <DialogTitle id="success">
                    Событие успешно{" "}
                    {possibleEvent ? "отредактировано" : "создано"}!
                </DialogTitle>
            </Dialog>
        </Container>
    );
}
