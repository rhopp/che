#!/bin/sh
#
# Copyright (c) 2012-2018 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
#
# Contributors:
#   Red Hat, Inc. - initial API and implementation
#
if [ -n "${POSTGRESQL_DEBUG+set}" ]; then
    echo "POSTGRESQL_DEBUG is set, possibly to the empty string"
    cp /opt/app-root/src/postgresql-cfg/postgresql.conf.debug /opt/app-root/src/postgresql-cfg/postgresql.conf
fi