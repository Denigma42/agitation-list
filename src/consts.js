export const DISTRICTS = 'districts';
export const TYPE_DISTRICTS = ['Кадровые офицеры', 'Офицеры запаса', 'Солдаты запаса'];

export const STATUS_SCHOOL = ['Зачислен', 'Отстранён', 'Переведён'];
export const STATUS_SCHOOL_KURSANT = ['Зачислен', 'Отчислен', 'Переведён'];

export const schoolColumns = [
    // {
    //     field: 'order',
    //     headerName: '№',
    //     width: 60,
    //     headerAlign: 'center',
    //     align: 'center',
    //     resizable: false,
    //     sortable: false,
    //     filterable: false,
    //     renderCell: (params) => {
    //         const allRowIds = params.api.getAllRowIds();
    //         return allRowIds.indexOf(params.id) + 1;
    //     }
    // },
    {
        field: 'schoolName',
        headerName: 'Образовательная организация',
        headerAlign: 'center',
        align: 'center',
        flex: 0.4,
        resizable: false,
    },
    {
        field: 'address',
        headerName: 'Адрес, телефон',
        headerAlign: 'center',
        align: 'center',
        flex: 0.3,
        resizable: false,
    },
    // {
    //     field: 'classGroup',
    //     headerName: 'Класс',
    //     headerAlign: 'center',
    //     align: 'center',
    //     flex: 0.25,
    //     resizable: false,
    // },
    {
        field: 'responsible',
        headerName: 'Ответственный за проф ориентацию',
        headerAlign: 'center',
        align: 'center',
        flex: 0.4,
        resizable: false,
    },
    {
        field: 'contacts',
        headerName: 'Контактный телефон',
        headerAlign: 'center',
        align: 'center',
        flex: 0.3,
        resizable: false,
    },
    {
        field: 'date',
        headerName: 'Дата посещения',
        headerAlign: 'center',
        align: 'center',
        flex: 0.2,
        resizable: false,
    },
    {
        field: 'fioExecutor',
        headerName: 'ФИО исполнителя',
        headerAlign: 'center',
        align: 'center',
        flex: 0.25,
        resizable: false,
    },
    {
        field: 'note',
        headerName: 'Примечание',
        headerAlign: 'center',
        align: 'center',
        flex: 0.2,
        resizable: false,
    },
];

export const withoutMicroDistrictTitle = "Учреждения без района"