create database trivin;

use trivin;

create table vins_rouges (
    id_vins_rouges int primary key auto_increment not null,
    nom varchar(255) not null,
    millesime varchar(4) not null,
    date_consommation datetime,
    etiquette text, 
    commentaire_personnel text,
    classement_general int
);

create table vins_blancs (
    id_vins_blancs int primary key auto_increment not null,
    nom varchar(255) not null,
    millesime varchar(4) not null,
    date_consommation datetime,
    etiquette text, 
    commentaire_personnel text,
    classement_general int
);

create table vins_roses (
    id_vins_roses int primary key auto_increment not null,
    nom varchar(255) not null,
    millesime varchar(4) not null,
    date_consommation datetime,
    etiquette text, 
    commentaire_personnel text,
    classement_general int
);

create table cepages (
    id_cepages int primary key auto_increment,
    nom varchar(255) not null
);

create table vins_rouges_has_cepages (
    id_vins_rouges_has_cepages int primary key auto_increment,
    id_vins_rouges int not null,
    id_cepages int not null,
    constraint vrouc1 FOREIGN KEY (id_vins_rouges) REFERENCES vins_rouges(id_vins_rouges) on delete cascade,
    constraint vrouc2 FOREIGN KEY (id_cepages) REFERENCES cepages(id_cepages) on delete cascade
);

create table vins_blancs_has_cepages (
    id_vins_blancs_has_cepages int primary key auto_increment,
    id_vins_blancs int not null,
    id_cepages int not null,
    constraint vblac1 foreign key (id_vins_blancs) references vins_blancs(id_vins_blancs) on delete cascade,
    constraint vblac2 foreign key (id_cepages) references cepages(id_cepages) on delete cascade
);

create table vins_roses_has_cepages (
    id_vins_roses_has_cepages int primary key auto_increment,
    id_vins_roses int not null,
    id_cepages int not null,
    constraint vrosc1 foreign key (id_vins_roses) references vins_roses(id_vins_roses) on delete cascade,
    constraint vrosc2 foreign key (id_cepages) references cepages(id_cepages) on delete cascade
);

create table vignerons (
    id_vignerons int primary key auto_increment,
    nom varchar(255)
);

create table vins_rouges_has_vignerons (
    id_vins_rouges_has_vignerons int primary key auto_increment,
    id_vins_rouges int not null,
    id_vignerons int not null,
    constraint vrouv1 foreign key (id_vins_rouges) references vins_rouges(id_vins_rouges) on delete cascade,
    constraint vrouv2 foreign key (id_vignerons) references vignerons(id_vignerons) on delete cascade
);

create table vins_blancs_has_vignerons (
    id_vins_blancs_has_vignerons int primary key auto_increment,
    id_vins_blancs int not null,
    id_vignerons int not null,
    constraint vblav1 foreign key (id_vins_blancs) references vins_blancs(id_vins_blancs) on delete cascade,
    constraint vblav2 foreign key (id_vignerons) references vignerons(id_vignerons) on delete cascade
);

create table vins_roses_has_vignerons (
    id_vins_roses_has_vignerons int primary key auto_increment,
    id_vins_roses int not null,
    id_vignerons int not null,
    constraint vrosv1 foreign key (id_vins_roses) references vins_roses(id_vins_roses) on delete cascade,
    constraint vrosv2 foreign key (id_vignerons) references vignerons(id_vignerons) on delete cascade
);

create table membres (
    id_membres int primary key auto_increment,
    email varchar(255) not null,
    password varchar(255) not null
);

create table classements_personnels_vins_rouges (
    id_classements_personnels_vins_rouges int primary key auto_increment,
    id_vins_rouges int not null,
    id_membres int not null,
    classements_personnels_vins_rouges int not null,
    constraint vroucp1 foreign key (id_vins_rouges) references vins_rouges(id_vins_rouges) on delete cascade,
    constraint vroucp2 foreign key (id_membres) references membres(id_membres) on delete cascade
);

create table classements_personnels_vins_blancs (
    id_classements_personnels_vins_blancs int primary key auto_increment,
    id_vins_blancs int not null,
    id_membres int not null,
    classements_personnels_vins_blancs int not null,
    constraint vblacp1 foreign key (id_vins_blancs) references vins_blancs(id_vins_blancs) on delete cascade,
    constraint vblacp2 foreign key (id_membres) references membres(id_membres) on delete cascade
);

create table classements_personnels_vins_roses (
    id_classements_personnels_vins_roses int primary key auto_increment,
    id_vins_roses int not null,
    id_membres int not null,
    classements_personnels_vins_roses int not null,
    constraint vroscp1 foreign key (id_vins_roses) references vins_roses(id_vins_roses) on delete cascade,
    constraint vroscp2 foreign key (id_membres) references membres(id_membres) on delete cascade
);